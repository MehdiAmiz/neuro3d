const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Your Shopify webhook secret
const WEBHOOK_SECRET = '1f196232a000ca9b51e3c3f308d0388a';

// Verify Shopify webhook signature
const verifyShopifyWebhook = (data, hmac) => {
  const calculated_hmac = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(data)
    .digest('base64');
  return calculated_hmac === hmac;
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});



// Handle order paid webhook (original endpoint)
app.post('/webhooks/shopify/order-paid', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body length:', req.body?.length || 0);
    console.log('Body type:', typeof req.body);
    
    // Check if we have a body
    if (!req.body || req.body.length === 0) {
      console.error('❌ Empty webhook body received');
      return res.status(400).send('Empty webhook body');
    }

    // Convert body to string if it's a Buffer
    const bodyString = req.body instanceof Buffer ? req.body.toString() : req.body.toString();
    console.log('Body string length:', bodyString.length);
    console.log('Body preview:', bodyString.substring(0, 200) + '...');

    // Verify webhook authenticity (optional for development with ngrok)
    const hmac = req.headers['x-shopify-hmac-sha256'];
    if (hmac) {
      if (!verifyShopifyWebhook(bodyString, hmac)) {
        console.warn('⚠️ Invalid webhook signature, but continuing for development');
        // Don't reject - just log a warning for development
      } else {
        console.log('✅ Webhook signature verified');
      }
    } else {
      console.warn('⚠️ No HMAC header found, but continuing for development');
    }

    // Parse JSON with error handling
    let order;
    try {
      order = JSON.parse(bodyString);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Raw body:', bodyString);
      return res.status(400).send('Invalid JSON');
    }

    console.log('Order ID:', order.id);
    console.log('Financial Status:', order.financial_status);
    console.log('Order Note:', order.note);
    console.log('Note Attributes:', JSON.stringify(order.note_attributes, null, 2));
    console.log('Line Items:', JSON.stringify(order.line_items, null, 2));
    console.log('========================');

    // Check if payment was successful
    if (order.financial_status === 'paid') {
      // Try multiple ways to get user attributes (unstable API might have different structures)
      let userId = null;
      let creditsToAdd = null;

      // Method 1: Check note_attributes
      if (order.note_attributes) {
        const userIdAttr = order.note_attributes.find(attr => attr.name === 'userId');
        const creditsAttr = order.note_attributes.find(attr => attr.name === 'credits');
        
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
        const CREDIT_PACK_MAPPING = {
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
        
        // Update user credits directly in shared database
        try {
          const { userService } = require('./shared-database.cjs');
          const user = await userService.getUserById(userId);
          if (user) {
            await userService.updateCredits(userId, user.credits + creditsToAdd);
            console.log(`✅ Successfully added ${creditsToAdd} credits to user ${userId}. New balance: ${user.credits + creditsToAdd}`);
          } else {
            console.error(`❌ User not found: ${userId}`);
          }
        } catch (error) {
          console.error('❌ Error updating user credits:', error);
        }
      } else {
        console.error('❌ Could not determine userId or credits from order data');
        console.log('Available data:', {
          note_attributes: order.note_attributes,
          note: order.note,
          line_items: order.line_items?.map(item => ({
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
});

// Handle payment success webhook (new endpoint that Shopify is trying to hit)
app.post('/api/shopify/payment-success', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    console.log('=== PAYMENT SUCCESS WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body length:', req.body?.length || 0);
    
    // Check if we have a body
    if (!req.body || req.body.length === 0) {
      console.error('❌ Empty webhook body received');
      return res.status(400).send('Empty webhook body');
    }

    // Convert body to string if it's a Buffer
    const bodyString = req.body instanceof Buffer ? req.body.toString() : req.body.toString();
    console.log('Body string length:', bodyString.length);
    console.log('Body preview:', bodyString.substring(0, 200) + '...');

    // Verify webhook authenticity (optional for development with ngrok)
    const hmac = req.headers['x-shopify-hmac-sha256'];
    if (hmac) {
      if (!verifyShopifyWebhook(bodyString, hmac)) {
        console.warn('⚠️ Invalid webhook signature, but continuing for development');
        // Don't reject - just log a warning for development
      } else {
        console.log('✅ Webhook signature verified');
      }
    } else {
      console.warn('⚠️ No HMAC header found, but continuing for development');
    }

    // Parse JSON with error handling
    let order;
    try {
      order = JSON.parse(bodyString);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Raw body:', bodyString);
      return res.status(400).send('Invalid JSON');
    }

    console.log('Order ID:', order.id);
    console.log('Financial Status:', order.financial_status);
    console.log('Order Note:', order.note);
    console.log('Note Attributes:', JSON.stringify(order.note_attributes, null, 2));
    console.log('Line Items:', JSON.stringify(order.line_items, null, 2));
    console.log('========================');

    // Check if payment was successful
    if (order.financial_status === 'paid') {
      // Try multiple ways to get user attributes (unstable API might have different structures)
      let userId = null;
      let creditsToAdd = null;

      // Method 1: Check note_attributes
      if (order.note_attributes) {
        const userIdAttr = order.note_attributes.find(attr => attr.name === 'userId');
        const creditsAttr = order.note_attributes.find(attr => attr.name === 'credits');
        
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
        const CREDIT_PACK_MAPPING = {
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
        
        // Update user credits directly in shared database
        try {
          const { userService } = require('./shared-database.cjs');
          const user = await userService.getUserById(userId);
          if (user) {
            await userService.updateCredits(userId, user.credits + creditsToAdd);
            console.log(`✅ Successfully added ${creditsToAdd} credits to user ${userId}. New balance: ${user.credits + creditsToAdd}`);
          } else {
            console.error(`❌ User not found: ${userId}`);
          }
        } catch (error) {
          console.error('❌ Error updating user credits:', error);
        }
      } else {
        console.error('❌ Could not determine userId or credits from order data');
        console.log('Available data:', {
          note_attributes: order.note_attributes,
          note: order.note,
          line_items: order.line_items?.map(item => ({
            variant_id: item.variant_id,
            title: item.title,
            quantity: item.quantity
          }))
        });
      }
    } else {
      console.log(`Order ${order.id} is not paid. Status: ${order.financial_status}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Parse JSON bodies for other routes
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhooks/shopify/order-paid`);
});
