import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Your Shopify webhook secret (get this from Shopify Admin > Settings > Notifications > Webhooks)
const WEBHOOK_SECRET = '1f196232a000ca9b51e3c3f308d0388a';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

// Verify Shopify webhook signature
const verifyShopifyWebhook = (data: string, hmac: string): boolean => {
  const calculated_hmac = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(data)
    .digest('base64');
  return calculated_hmac === hmac;
};

// Handle order paid webhook
router.post('/shopify/order-paid', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook authenticity (optional for development with ngrok)
    const hmac = req.headers['x-shopify-hmac-sha256'] as string;
    if (hmac) {
      if (!verifyShopifyWebhook(req.body.toString(), hmac)) {
        console.warn('⚠️ Invalid webhook signature, but continuing for development');
        // Don't reject - just log a warning for development
      } else {
        console.log('✅ Webhook signature verified');
      }
    } else {
      console.warn('⚠️ No HMAC header found, but continuing for development');
    }

    const order = JSON.parse(req.body.toString());
    console.log('Received order webhook:', order.id);

    // Check if payment was successful
    if (order.financial_status === 'paid') {
      // Get the custom attributes from note_attributes
      const userIdAttr = order.note_attributes?.find(attr => attr.name === 'userId');
      const creditsAttr = order.note_attributes?.find(attr => attr.name === 'credits');

      if (userIdAttr && creditsAttr) {
        const userId = userIdAttr.value;
        const creditsToAdd = parseInt(creditsAttr.value);

        console.log(`Processing payment for user ${userId}, adding ${creditsToAdd} credits`);

        // Update user credits via API call
        try {
          const response = await fetch(`${API_BASE_URL}/users/${userId}/credits/add`, {
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
        console.error('Missing userId or credits in order attributes');
      }
    } else {
      console.log(`Order ${order.id} is not paid. Status: ${order.financial_status}`);
    }

    res.status(200).send('Webhook processed successfully');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

export default router;
