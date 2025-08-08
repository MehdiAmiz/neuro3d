# Unified Architecture Implementation

## 🎯 **Overview**

This project now uses a **unified architecture** with a single database and API layer, eliminating the previous multi-database approach.

## 🏗️ **New Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (In-Memory)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              ▲
                              │
                       ┌─────────────────┐
                       │   Webhooks      │
                       │   (Shopify)     │
                       └─────────────────┘
```

## 📁 **File Structure**

### **New Files**
```
src/
├── server/
│   ├── api.ts                    # Unified API endpoints
│   ├── unified-server.ts         # Main server (API + Webhooks)
│   └── webhooks.ts               # Updated webhook handlers
├── lib/
│   ├── database.ts               # Single database (unchanged)
│   └── api-client.ts             # Frontend API client
└── contexts/
    └── AuthContext.tsx           # Updated to use API client

start-unified-server.js           # Server startup script
UNIFIED_ARCHITECTURE.md           # This documentation
```

### **Removed Files** (No longer needed)
```
main-database.cjs                 # ❌ Removed
webhook-database.cjs              # ❌ Removed
server.cjs                        # ❌ Replaced by unified-server.ts
```

## 🚀 **Getting Started**

### **1. Start the Unified Server**
```bash
# Option 1: Using the startup script
npm run server:unified

# Option 2: Direct TypeScript execution
npm run server:api
```

### **2. Start the Frontend**
```bash
npm run dev
```

## 🔧 **API Endpoints**

### **Authentication**
```
POST /api/auth/register          # Register new user
POST /api/auth/login             # User login
POST /api/auth/check-email       # Check email availability
```

### **User Management**
```
GET    /api/users/:id            # Get user by ID
PUT    /api/users/:id            # Update user
```

### **Credit Management**
```
POST /api/users/:id/credits              # Set credits
POST /api/users/:id/credits/add          # Add credits
POST /api/users/:id/credits/deduct-video # Deduct video credits
POST /api/users/:id/credits/deduct-3d    # Deduct 3D model credits
```

### **Admin**
```
GET /api/admin/users             # Get all users
```

### **Health Check**
```
GET /health                      # Server health check
```

### **Webhooks**
```
POST /webhooks/shopify/order-paid        # Shopify payment webhook
POST /api/shopify/payment-success        # Alternative webhook endpoint
```

## 🔄 **Data Flow**

### **1. User Registration/Login**
```
Frontend → API Client → API Endpoint → Database
```

### **2. Credit Updates (Webhook)**
```
Shopify → Webhook Handler → API Endpoint → Database
```

### **3. Service Usage**
```
Frontend → API Client → API Endpoint → Database
```

## ✅ **Benefits of Unified Architecture**

### **1. Single Source of Truth**
- One database instance
- No data inconsistency
- Simplified data management

### **2. Centralized API**
- All operations go through the same API
- Consistent error handling
- Standardized responses

### **3. Better Maintainability**
- Single codebase for database operations
- Easier to add new features
- Reduced code duplication

### **4. Improved Testing**
- Test API endpoints directly
- Mock API responses for frontend tests
- Isolated testing of components

### **5. Production Ready**
- Easy to replace in-memory DB with real database
- API-first architecture
- Scalable design

## 🔧 **Configuration**

### **Environment Variables**
```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
API_BASE_URL=http://localhost:8080/api

# Server Configuration
PORT=8080

# Shopify Configuration
WEBHOOK_SECRET=your_webhook_secret
```

## 🧪 **Testing the Architecture**

### **1. Test API Endpoints**
```bash
# Health check
curl http://localhost:8080/health

# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **2. Test Webhook**
```bash
# Simulate webhook (replace with actual Shopify webhook)
curl -X POST http://localhost:8080/webhooks/shopify/order-paid \
  -H "Content-Type: application/json" \
  -d '{"financial_status":"paid","note_attributes":[{"name":"userId","value":"test123"},{"name":"credits","value":"1000"}]}'
```

## 🔄 **Migration from Old Architecture**

### **What Changed**
1. **Frontend**: Now uses `api-client.ts` instead of direct database calls
2. **Webhooks**: Now call API endpoints instead of direct database access
3. **Server**: Single unified server instead of separate webhook server

### **What Stayed the Same**
1. **Database Schema**: User model remains unchanged
2. **Authentication Flow**: Login/register process unchanged
3. **Credit System**: Same deduction logic

## 🚀 **Next Steps for Production**

### **1. Replace In-Memory Database**
```typescript
// Replace src/lib/database.ts with:
- PostgreSQL + Prisma
- MongoDB + Mongoose
- Firebase Firestore
- Supabase
```

### **2. Add Authentication**
```typescript
// Add JWT tokens
- JWT middleware
- Token refresh
- Session management
```

### **3. Add Security**
```typescript
// Security enhancements
- Password hashing (bcrypt)
- Rate limiting
- CORS configuration
- Input validation
```

### **4. Add Monitoring**
```typescript
// Monitoring and logging
- Request logging
- Error tracking
- Performance monitoring
- Health checks
```

## 📊 **Performance Benefits**

- **Reduced Memory Usage**: Single database instance
- **Faster Development**: No need to sync multiple databases
- **Better Debugging**: Centralized logging and error handling
- **Easier Deployment**: Single server to deploy and manage

## 🔍 **Troubleshooting**

### **Common Issues**

1. **API Connection Failed**
   - Check if server is running on correct port
   - Verify `VITE_API_URL` environment variable
   - Check CORS configuration

2. **Webhook Not Working**
   - Verify webhook URL is correct
   - Check webhook secret
   - Ensure server is accessible from Shopify

3. **Database Issues**
   - Check database initialization
   - Verify user creation in database
   - Check API endpoint responses

### **Debug Commands**
```bash
# Check server status
curl http://localhost:8080/health

# Check API endpoints
curl http://localhost:8080/api/admin/users

# Test webhook endpoint
curl -X POST http://localhost:8080/webhooks/shopify/order-paid
```

This unified architecture provides a solid foundation for both development and production use!
