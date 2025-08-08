// Shopify Configuration
// Your Shopify store credentials and settings

export const SHOPIFY_CONFIG = {
  SHOP_DOMAIN: 'ifeh7q-xz.myshopify.com',
  API_KEY: 'f00d284c69dbfc101fcf7eee522d3d43',
  API_SECRET: '1f196232a000ca9b51e3c3f308d0388a',
  ACCESS_TOKEN: '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',
  API_VERSION: '2024-01',
  CURRENCY: 'USD',
  COUNTRY_CODE: 'US',
  SUCCESS_URL: `${window.location.origin}/checkout/success`,
  CANCEL_URL: `${window.location.origin}/checkout/cancel`,
};

export const CREDIT_PRODUCTS = {
  starter: {
    productId: '7650565980238', // Replace with actual product ID
    title: 'Starter Credits',
    credits: 3000,
    price: 14.00,
  },
  professional: {
    productId: '7650571419726', // Replace with actual product ID
    title: 'Professional Credits',
    credits: 5000,
    price: 20.00,
  },
  enterprise: {
    productId: '7650572763214', // Replace with actual product ID
    title: 'Enterprise Credits',
    credits: 20000,
    price: 50.00,
  },
}; 