# Database & Authentication Setup Guide

## 🗄️ **Current Implementation**

### **In-Memory Database**
- **Location**: `src/lib/database.ts`
- **Type**: In-memory storage (for development/demo)
- **Features**: User management, authentication, CRUD operations

### **Authentication System**
- **Context**: `src/contexts/AuthContext.tsx`
- **State Management**: React Context + localStorage
- **Features**: Login, Register, Logout, Session persistence

## 🚀 **Features Implemented**

### **User Management**
- ✅ User registration with validation
- ✅ User login with credential verification
- ✅ User logout and session management
- ✅ Password visibility toggle
- ✅ Form validation (email, password, name)
- ✅ Error handling and success states
- ✅ Session persistence (localStorage)

### **Database Operations**
- ✅ Create user
- ✅ Find user by email/ID
- ✅ Update user
- ✅ Delete user
- ✅ Get all users
- ✅ Email uniqueness validation
- ✅ Password validation

### **UI Components**
- ✅ Authentication modal with tabs
- ✅ User profile dropdown in header
- ✅ Database viewer (development tool)
- ✅ Loading states and animations
- ✅ Error messages and success feedback

## 🧪 **Testing the System**

### **Test User Credentials**
```
Email: test@example.com
Password: password123
```

### **How to Test**
1. **Register a new user**:
   - Click "Sign In" → "Sign Up" tab
   - Fill out the form with valid data
   - Submit and verify success

2. **Login with existing user**:
   - Use test credentials above
   - Or register a new account and login

3. **View Database**:
   - Go to `/app` page
   - See the database viewer in bottom-right corner
   - View all registered users

4. **User Management**:
   - Click user avatar in header
   - See user dropdown with logout option
   - Test logout functionality

## 🔧 **Production Database Options**

### **Option 1: PostgreSQL + Prisma**
```bash
# Install dependencies
npm install @prisma/client prisma bcryptjs

# Initialize Prisma
npx prisma init

# Create schema
# prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Option 2: MongoDB + Mongoose**
```bash
# Install dependencies
npm install mongoose bcryptjs

# Create User model
# models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### **Option 3: Firebase Authentication**
```bash
# Install Firebase
npm install firebase

# Configure Firebase
# lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```

### **Option 4: Supabase**
```bash
# Install Supabase
npm install @supabase/supabase-js

# Configure Supabase
# lib/supabase.js
import { createClient } from '@supabase/supabase-js';
```

## 🔐 **Security Enhancements**

### **Password Hashing**
```typescript
import bcrypt from 'bcryptjs';

// Hash password before saving
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### **JWT Tokens**
```typescript
import jwt from 'jsonwebtoken';

// Generate token
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### **Environment Variables**
```env
# .env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 📊 **Database Schema**

### **User Table**
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Additional Tables (Future)**
```sql
-- Projects table for 3D models
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  model_url VARCHAR(500),
  preview_url VARCHAR(500),
  status ENUM('processing', 'completed', 'failed'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id),
  plan_type ENUM('free', 'pro', 'enterprise'),
  status ENUM('active', 'cancelled', 'expired'),
  start_date TIMESTAMP,
  end_date TIMESTAMP
);
```

## 🚀 **Migration Steps**

### **Step 1: Choose Database**
1. Select your preferred database solution
2. Set up database instance
3. Install necessary dependencies

### **Step 2: Update Database Service**
1. Replace `src/lib/database.ts` with your database implementation
2. Update authentication functions
3. Add proper error handling

### **Step 3: Environment Setup**
1. Create `.env` file with database credentials
2. Add environment variables to deployment
3. Test connection

### **Step 4: Security Implementation**
1. Add password hashing
2. Implement JWT tokens
3. Add rate limiting
4. Set up CORS policies

## 📝 **API Endpoints (Future)**

### **Authentication**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### **Users**
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### **Projects**
```
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

## 🔍 **Current File Structure**
```
src/
├── lib/
│   └── database.ts          # Database operations
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── components/
│   ├── AuthModal.tsx        # Login/Register modal
│   ├── Header.tsx           # Header with user menu
│   └── DatabaseViewer.tsx   # Development database viewer
└── App.tsx                  # Main app with AuthProvider
```

## ✅ **Next Steps**

1. **Choose production database**
2. **Implement password hashing**
3. **Add JWT authentication**
4. **Set up environment variables**
5. **Add user roles and permissions**
6. **Implement project management**
7. **Add subscription system**
8. **Set up email verification**

The current implementation provides a solid foundation for user authentication and can be easily extended with a production database! 