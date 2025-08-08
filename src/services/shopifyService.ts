import { SHOPIFY_CONFIG, CREDIT_PRODUCTS } from '@/config/shopify';

interface ShopifyOrder {
  id: string;
  order_number: number;
  total_price: string;
  currency: string;
  customer: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  line_items: Array<{
    title: string;
    quantity: number;
    price: string;
    properties: Array<{
      name: string;
      value: string;
    }>;
  }>;
  created_at: string;
  financial_status: string;
  fulfillment_status: string;
}

interface CreateOrderParams {
  packageId: string;
  credits: number;
  price: number;
  userId: string;
  customerEmail: string;
}

class ShopifyService {
  private baseUrl = `https://${SHOPIFY_CONFIG.SHOP_DOMAIN}/admin/api/${SHOPIFY_CONFIG.API_VERSION}`;
  private headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': SHOPIFY_CONFIG.ACCESS_TOKEN,
  };

  async createOrder(params: CreateOrderParams): Promise<ShopifyOrder> {
    const product = CREDIT_PRODUCTS[params.packageId as keyof typeof CREDIT_PRODUCTS];
    if (!product) {
      throw new Error('Invalid package ID');
    }

    const orderData = {
      order: {
        line_items: [
          {
            title: product.title,
            quantity: 1,
            price: params.price.toString(),
            properties: [
              { name: 'Credits', value: params.credits.toString() },
              { name: 'User ID', value: params.userId }
            ]
          }
        ],
        customer: { email: params.customerEmail },
        tags: `credits-${params.credits},user-${params.userId}`,
        note: `Credit purchase: ${params.credits} credits for user ${params.userId}`,
        financial_status: 'paid',
        send_receipt: true,
        send_fulfillment_receipt: false,
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/orders.json`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Shopify order creation error:', error);
      throw new Error('Failed to create Shopify order');
    }
  }

  async getOrder(orderId: string): Promise<ShopifyOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}.json`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error('Shopify order retrieval error:', error);
      throw new Error('Failed to retrieve Shopify order');
    }
  }

  async createCheckoutSession(params: CreateOrderParams): Promise<{ checkout_url: string }> {
    const product = CREDIT_PRODUCTS[params.packageId as keyof typeof CREDIT_PRODUCTS];
    if (!product) {
      throw new Error('Invalid package ID');
    }

    const checkoutData = {
      checkout: {
        line_items: [
          {
            variant_id: product.variantId.split('/').pop(),
            quantity: 1,
            properties: [
              { name: 'Credits', value: params.credits.toString() },
              { name: 'User ID', value: params.userId }
            ]
          }
        ],
        customer: { email: params.customerEmail },
        tags: `credits-${params.credits},user-${params.userId}`,
        note: `Credit purchase: ${params.credits} credits for user ${params.userId}`,
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/checkouts.json`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return { checkout_url: data.checkout.web_url };
    } catch (error) {
      console.error('Shopify checkout creation error:', error);
      throw new Error('Failed to create Shopify checkout session');
    }
  }

  // Simulate payment processing for development
  async simulatePayment(params: CreateOrderParams): Promise<{ success: boolean; orderId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      }, 2000);
    });
  }
}

export const shopifyService = new ShopifyService(); 