import Client from 'shopify-buy';
import { userService } from './database';

// Initialize the Shopify client
const client = Client.buildClient({
  domain: 'neuro3d.myshopify.com',
  storefrontAccessToken: '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',
  apiVersion: '2024-01', // Using a stable version
  language: 'en',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Credit pack variant IDs and their credit values
const CREDIT_PACKS = {
  '42665373925454': { credits: 3000, name: 'Starter' },
  '42665410035790': { credits: 5000, name: 'Professional' },
  '42665416851534': { credits: 20000, name: 'Enterprise' }
};

export const shopifyService = {
  // Create checkout for a credit pack
  async createCheckout(variantId: string, userId: string, userEmail: string) {
    try {
      // Create input for checkout
      const input = {
        lineItems: [
          {
            variantId: `gid://shopify/ProductVariant/${variantId}`,
            quantity: 1
          }
        ],
        email: userEmail,
        customAttributes: [
          { key: 'userId', value: userId },
          { key: 'credits', value: CREDIT_PACKS[variantId].credits.toString() }
        ]
      };

      // Create checkout directly
      const checkout = await client.checkout.create(input);

      // Store checkout ID and credits in localStorage
      if (checkout && checkout.id) {
        localStorage.setItem('shopify_checkout_id', checkout.id);
        localStorage.setItem('credits_to_add', CREDIT_PACKS[variantId].credits.toString());
        return checkout.webUrl;
      } else {
        throw new Error('Failed to create checkout');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw new Error('Failed to create checkout. Please try again.');
    }
  },

  // Verify checkout status
  async verifyCheckout(checkoutId: string): Promise<boolean> {
    try {
      const checkout = await client.checkout.fetch(checkoutId);
      return checkout.completedAt != null;
    } catch (error) {
      console.error('Error verifying checkout:', error);
      return false;
    }
  }
};