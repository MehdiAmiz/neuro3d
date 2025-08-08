import { userService } from '@/lib/api-client';

interface ShopifyOrder {
  id: string;
  email: string;
  line_items: {
    variant_id: string;
    quantity: number;
  }[];
  financial_status: string;
}

const CREDIT_PACK_MAPPING = {
  '42665373925454': 3000,  // Starter Pack - 3,000 credits
  '42665410035790': 5000,  // Professional Pack - 5,000 credits
  '42665416851534': 20000, // Enterprise Pack - 20,000 credits
};

export const handleShopifyWebhook = async (order: ShopifyOrder) => {
  try {
    // Only process paid orders
    if (order.financial_status !== 'paid') {
      console.log(`Order ${order.id} is not paid. Status: ${order.financial_status}`);
      return;
    }

    // Find user by email
    const user = await userService.findUserByEmail(order.email);
    if (!user) {
      console.error(`User not found for email: ${order.email}`);
      return;
    }

    // Calculate total credits from all line items
    let totalCredits = 0;
    for (const item of order.line_items) {
      const variantId = item.variant_id;
      const credits = CREDIT_PACK_MAPPING[variantId];
      if (credits) {
        totalCredits += credits * item.quantity;
      }
    }

    if (totalCredits > 0) {
      // Update user credits
      const updatedUser = await userService.updateCredits(user.id, user.credits + totalCredits);
      console.log(`Added ${totalCredits} credits to user ${user.email}. New balance: ${updatedUser.credits}`);
    }

  } catch (error) {
    console.error('Error processing Shopify webhook:', error);
    throw error;
  }
};
