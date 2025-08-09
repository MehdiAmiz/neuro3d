import express from 'express';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { userService } from '../lib/postgres-database';

const router = express.Router();

// Basic rate limiting for auth and user endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

// Middleware to parse JSON
router.use(express.json({ limit: '1mb' }));
router.use('/auth', authLimiter);
router.use('/users', authLimiter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication endpoints
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and password are required' 
      });
    }

    const user = await userService.register({ name, email, password });
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const user = await userService.login(email, password);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid credentials' 
    });
  }
});

// Google Sign-In with ID token (Option A)
router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body as { idToken?: string };
    if (!idToken) {
      return res.status(400).json({ success: false, error: 'idToken is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ success: false, error: 'Google client ID not configured' });
    }

    const oauthClient = new OAuth2Client(clientId);
    const ticket = await oauthClient.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      return res.status(401).json({ success: false, error: 'Invalid Google token' });
    }

    const user = await userService.upsertGoogleUser({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      avatarUrl: payload.picture || null,
      emailVerified: payload.email_verified ?? null,
    });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google authentication failed';
    console.error('Google auth error:', message);
    return res.status(401).json({ success: false, error: message });
  }
});

// User management endpoints
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(404).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'User not found' 
    });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.is('application/json')) {
      return res.status(415).json({ success: false, error: 'Content-Type must be application/json' });
    }

    const { name, email } = req.body as { name?: unknown; email?: unknown };

    const updates: Record<string, any> = {};

    if (typeof name === 'string') {
      const trimmed = name.trim();
      if (trimmed.length < 1 || trimmed.length > 255) {
        return res.status(400).json({ success: false, error: 'Name must be between 1 and 255 characters' });
      }
      updates.name = trimmed;
    }

    if (typeof email === 'string') {
      const trimmed = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed) || trimmed.length > 255) {
        return res.status(400).json({ success: false, error: 'Invalid email address' });
      }
      updates.email = trimmed.toLowerCase();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    const user = await userService.updateUser(id, updates);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Update failed' 
    });
  }
});

// Credit management endpoints
router.post('/users/:id/credits', async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;
    
    if (typeof credits !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Credits must be a number' 
      });
    }

    const user = await userService.updateCredits(id, credits);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update credits error:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update credits' 
    });
  }
});

router.post('/users/:id/credits/add', async (req, res) => {
  try {
    const { id } = req.params;
    const { creditsToAdd } = req.body;
    
    if (typeof creditsToAdd !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'creditsToAdd must be a number' 
      });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updatedUser = await userService.updateCredits(id, user.credits + creditsToAdd);
    res.status(200).json({ 
      success: true, 
      user: updatedUser,
      oldCredits: user.credits,
      newCredits: updatedUser.credits
    });
  } catch (error) {
    console.error('Add credits error:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add credits' 
    });
  }
});

// Service credit deduction endpoints
router.post('/users/:id/credits/deduct-video', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deductVideoCredits(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Deduct video credits error:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to deduct credits' 
    });
  }
});

router.post('/users/:id/credits/deduct-3d', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deduct3DModelCredits(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Deduct 3D credits error:', error);
    res.status(400).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to deduct credits' 
    });
  }
});

// Admin endpoints
router.get('/admin/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get users' 
    });
  }
});

router.get('/admin/analytics', async (req, res) => {
  try {
    const analytics = await userService.getAnalytics();
    res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get analytics' 
    });
  }
});

router.get('/admin/analytics/:period', async (req, res) => {
  try {
    const { period } = req.params; // today, week, month, all
    const analytics = await userService.getAnalyticsByPeriod(period);
    res.status(200).json({ success: true, analytics });
  } catch (error) {
    console.error('Get analytics by period error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get analytics' 
    });
  }
});

router.delete('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete user' 
    });
  }
});

// Email validation endpoint
router.post('/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }

    const exists = await userService.checkEmailExists(email);
    res.status(200).json({ success: true, exists });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to check email' 
    });
  }
});

export default router;
