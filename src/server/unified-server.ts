import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
import apiRouter from './api';
import postgresDb from '../lib/postgres-database';

const app = express();
const PORT = process.env.PORT || 8080;

// Your Shopify webhook secret
const WEBHOOK_SECRET = '1f196232a000ca9b51e3c3f308d0388a';

// Enable CORS
app.use(cors({
  origin: ['http://91.108.112.113', 'http://91.108.112.113:8080', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON bodies for API routes
app.use(express.json());

// Verify Shopify webhook signature
const verifyShopifyWebhook = (data: string, hmac: string): boolean => {
  const calculated_hmac = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(data)
    .digest('base64');
  return calculated_hmac === hmac;
};

// Mount API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Unified server is running'
  });
});

// Shared handler for Shopify payment webhooks
const handleShopifyPayment = async (req: express.Request, res: express.Response) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // Check if we have a body
    if (!req.body) {
      console.error('❌ Empty webhook body received');
      return res.status(400).send('Empty webhook body');
    }

    // Verify webhook authenticity (optional for development with ngrok)
    const hmac = req.headers['x-shopify-hmac-sha256'] as string;
    if (hmac) {
      const bodyString = JSON.stringify(req.body);
      if (!verifyShopifyWebhook(bodyString, hmac)) {
        console.warn('⚠️ Invalid webhook signature, but continuing for development');
      } else {
        console.log('✅ Webhook signature verified');
      }
    } else {
      console.warn('⚠️ No HMAC header found, but continuing for development');
    }

    // Use the parsed JSON body directly
    const order = req.body;

    console.log('Order ID:', order.id);
    console.log('Financial Status:', order.financial_status);
    console.log('Order Note:', order.note);
    console.log('Note Attributes:', JSON.stringify(order.note_attributes, null, 2));
    console.log('Line Items:', JSON.stringify(order.line_items, null, 2));
    console.log('========================');

    // Check if payment was successful
    if (order.financial_status === 'paid') {
      // Try multiple ways to get user attributes
      let userId = null;
      let creditsToAdd = null;

      // Method 1: Check note_attributes
      if (order.note_attributes) {
        const userIdAttr = order.note_attributes.find((attr: any) => attr.name === 'userId');
        const creditsAttr = order.note_attributes.find((attr: any) => attr.name === 'credits');
        
        if (userIdAttr && creditsAttr) {
          userId = userIdAttr.value;
          creditsToAdd = parseInt(creditsAttr.value);
        }
      }

      // Method 2: Check order note (fallback)
      if (!userId && order.note) {
        try {
          const noteData = JSON.parse(order.note);
          userId = noteData.userId;
          creditsToAdd = parseInt(noteData.credits);
        } catch (e) {
          console.log('Could not parse order note as JSON');
        }
      }

      // Method 3: Check line items for variant ID mapping
      if (!creditsToAdd && order.line_items) {
        const CREDIT_PACK_MAPPING: { [key: string]: number } = {
          '42665373925454': 3000,  // Starter Pack
          '42665410035790': 5000,  // Professional Pack
          '42665416851534': 20000, // Enterprise Pack
        };

        for (const item of order.line_items) {
          const variantId = item.variant_id?.toString();
          if (variantId && CREDIT_PACK_MAPPING[variantId]) {
            creditsToAdd = CREDIT_PACK_MAPPING[variantId] * item.quantity;
            break;
          }
        }
      }

      if (userId && creditsToAdd) {
        console.log(`Processing payment for user ${userId}, adding ${creditsToAdd} credits`);
        
        // Update user credits via internal API call
        try {
          const response = await fetch(`http://localhost:${PORT}/api/users/${userId}/credits/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              creditsToAdd: creditsToAdd
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Successfully added ${creditsToAdd} credits to user ${userId}. New balance: ${result.newCredits}`);
          } else {
            const errorData = await response.json();
            console.error(`❌ Failed to update credits for user ${userId}:`, errorData.error);
          }
        } catch (error) {
          console.error('❌ Error updating user credits:', error);
        }
      } else {
        console.error('❌ Could not determine userId or credits from order data');
        console.log('Available data:', {
          note_attributes: order.note_attributes,
          note: order.note,
          line_items: order.line_items?.map((item: any) => ({
            variant_id: item.variant_id,
            title: item.title,
            quantity: item.quantity
          }))
        });
      }
    } else {
      console.log(`Order ${order.id} is not paid. Status: ${order.financial_status}`);
    }

    res.status(200).send('Webhook processed successfully');
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
};

// Handle order paid webhook
app.post('/webhooks/shopify/order-paid', express.json(), handleShopifyPayment);

// Handle payment success webhook (alternative endpoint)
app.post('/api/shopify/payment-success', express.json(), handleShopifyPayment);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize PostgreSQL database
    await postgresDb.init();
    console.log('✅ PostgreSQL database initialized');
    
    app.listen(PORT, () => {
      console.log(`🚀 Unified server is running on port ${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhooks/shopify/order-paid`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
