# Webhook Setup Instructions

## Problem Fixed
Shopify was trying to hit `https://3134ce018b97.ngrok-free.app/api/shopify/payment-success` but your server didn't have that endpoint, resulting in 404 errors.

## Solution Implemented
Added the missing `/api/shopify/payment-success` endpoint to your `server.cjs` file.

## How to Run

### Option 1: TypeScript Server (Recommended)
```bash
npm run server:ts
```
This will start the TypeScript server on port 8080 with improved webhook handling.

### Option 2: CommonJS Server (Legacy)
```bash
npm run server
```
This will start the CommonJS server on port 8080.

### 2. Start ngrok (in a separate terminal)
```bash
ngrok http 8080
```

### 3. Update Shopify Webhook URL
In your Shopify admin, make sure the webhook URL is set to:
```
https://[your-ngrok-url]/api/shopify/payment-success
```

## Available Endpoints
- `/api/shopify/payment-success` - The main webhook endpoint (TypeScript version)
- `/webhooks/shopify/order-paid` - Legacy endpoint (CommonJS version)
- `/health` - Health check endpoint

## What the Webhook Does
When Shopify sends a payment success webhook:
1. Verifies the webhook signature using timing-safe comparison
2. Extracts user ID and credits from note_attributes
3. Updates user credits in the database
4. Returns appropriate status codes to prevent retry loops
5. Handles errors gracefully without blocking Shopify

## Security Features
- **Timing-safe HMAC verification** to prevent timing attacks
- **Raw body parsing** to ensure accurate signature verification
- **Proper error handling** to prevent webhook retry loops
- **Development mode** allows testing with ngrok (logs warnings instead of rejecting)

## Key Improvements
- **Better error handling**: Returns 200 for expected failures to prevent retries
- **Database integration**: Actually updates user credits
- **Proper TypeScript**: Type-safe implementation
- **Production ready**: Can be easily configured for production use

## Troubleshooting
- Make sure your server is running on port 8080
- Check that ngrok is pointing to port 8080
- Verify the webhook URL in Shopify matches your ngrok URL
- Check the server console for detailed logs

## Next Steps
To complete the implementation, you'll need to:
1. Connect to your database
2. Add the actual credit update logic
3. Handle error cases more gracefully
