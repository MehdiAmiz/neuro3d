// Database configuration and user management
// This is a simple in-memory database for demonstration
// In production, you would use a real database like PostgreSQL, MongoDB, or Firebase

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  credits: number;
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin';
  isAdmin: boolean;
}

// In-memory database (replace with real database in production)
class Database {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> userId

  constructor() {
    // Initialize admin users synchronously
    const createAdminUser = async () => {
      // Create test admin with specific ID to match webhook database
      const testUser = await this.createUser({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      });
      // Update the user ID to match the webhook database
      const updatedTestUser = await this.updateUser(testUser.id, {
        id: 'me26tis67vr0gsoylsw', // Use the same ID as webhook database
        role: 'admin',
        isAdmin: true,
        credits: 10000
      });

      // Create dedicated admin
      const adminUser = await this.createUser({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123"
      });
      await this.updateUser(adminUser.id, {
        role: 'admin',
        isAdmin: true,
        credits: 99999
      });
    };

    // Execute immediately
    createAdminUser().catch(console.error);
  }

  // Initialize test user with credits
  async initializeTestUser() {
    const testUser = await this.findUserByEmail("test@example.com");
    if (testUser) {
      await this.updateUser(testUser.id, { credits: 10000 });
    }
  }

  // Create a new user
  async createUser(userData: { name: string; email: string; password: string }): Promise<User> {
    // Check if email already exists
    if (this.emailIndex.has(userData.email)) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: this.generateId(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In production, hash this password
      credits: 0, // Default credits for new users
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      isAdmin: false
    };

    this.users.set(user.id, user);
    this.emailIndex.set(user.email, user.id);

    return user;
  }

  // Find user by email
  async findUserByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email);
    if (!userId) return null;
    
    return this.users.get(userId) || null;
  }

  // Find user by ID
  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const existingUser = this.users.get(id);
    if (!existingUser) return null;

    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: new Date()
    };

    // If the ID is being changed, move the entry in the map and update email index
    const targetId = updates.id && updates.id !== id ? updates.id : id;
    if (targetId !== id) {
      // Remove old key
      this.users.delete(id);
      // Set new key
      this.users.set(targetId, updatedUser);
      // Keep email index pointing to the new ID
      this.emailIndex.set(updatedUser.email, targetId);
    } else {
      this.users.set(id, updatedUser);
    }

    return updatedUser;
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    this.users.delete(id);
    this.emailIndex.delete(user.email);
    return true;
  }

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Validate user credentials
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    // In production, compare hashed passwords
    if (user.password !== password) return null;

    return user;
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    return this.emailIndex.has(email);
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Create singleton instance
export const db = new Database();

// Initialize test user with credits
db.initializeTestUser().catch(console.error);

// Export database functions
export const userService = {
  // Find user by email
  async findUserByEmail(email: string) {
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return null;
      }
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },
  // Register new user
  async register(userData: { name: string; email: string; password: string }) {
    try {
      const user = await db.createUser(userData);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(email: string, password: string) {
    try {
      const user = await db.validateCredentials(email, password);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Ensure admin fields are set
      if (user.email === "admin@example.com" || user.email === "test@example.com") {
        await db.updateUser(user.id, {
          role: 'admin',
          isAdmin: true
        });
        // Get the updated user
        const updatedUser = await db.findUserById(user.id);
        if (updatedUser) {
          const { password: _, ...userWithoutPassword } = updatedUser;
          return userWithoutPassword;
        }
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id: string) {
    try {
      const user = await db.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  async updateUser(id: string, updates: Partial<User>) {
    try {
      const user = await db.updateUser(id, updates);
      if (!user) {
        throw new Error('User not found');
      }
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Check if email exists
  async checkEmailExists(email: string) {
    return await db.emailExists(email);
  },

  // Update user credits
  async updateCredits(id: string, credits: number) {
    try {
      const user = await db.updateUser(id, { credits });
      if (!user) {
        throw new Error('User not found');
      }
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Change user password
  async changePassword(id: string, currentPassword: string, newPassword: string) {
    try {
      const user = await db.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      if (user.password !== currentPassword) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const updatedUser = await db.updateUser(id, { password: newPassword });
      if (!updatedUser) {
        throw new Error('Failed to update password');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Deduct credits for video generation
  async deductVideoCredits(id: string) {
    try {
      const user = await db.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.credits < 50) {
        throw new Error('Insufficient credits. You need 50 credits to generate a video.');
      }

      const updatedUser = await db.updateUser(id, { credits: user.credits - 50 });
      if (!updatedUser) {
        throw new Error('Failed to deduct credits');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Deduct credits for 3D model generation
  async deduct3DModelCredits(id: string) {
    try {
      const user = await db.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.credits < 50) {
        throw new Error('Insufficient credits. You need 50 credits to generate a 3D model.');
      }

      const updatedUser = await db.updateUser(id, { credits: user.credits - 50 });
      if (!updatedUser) {
        throw new Error('Failed to deduct credits');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  // Get all users (for admin purposes)
  async getAllUsers() {
    try {
      const users = await db.getAllUsers();
      // Remove passwords from all users
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw error;
    }
  }
}; 