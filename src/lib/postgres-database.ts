import pool from './postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  credits: number;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
}

function sanitizeUser(row: User) {
  const { password_hash, ...rest } = row as any;
  return rest;
}

export class PostgresDatabase {
  private pool = pool;

  async init(): Promise<void> {
    try {
      await this.pool.query('SELECT NOW()');
      console.log('PostgreSQL database connected successfully');
    } catch (error) {
      console.error('Failed to connect to PostgreSQL:', error);
      throw error;
    }
  }

  async createUser(userData: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    const { id, email, name, password_hash, credits, is_admin } = userData;
    const query = `
      INSERT INTO users (id, email, name, password_hash, credits, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [id, email, name, password_hash, credits, is_admin];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return this.getUserById(id);

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [id, ...fields.map(field => (updates as any)[field])];
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async updateUserCredits(id: string, credits: number): Promise<User | null> {
    const result = await this.pool.query('UPDATE users SET credits = $2 WHERE id = $1 RETURNING *', [id, credits]);
    return result.rows[0] || null;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  async getAnalytics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), now.getMonth() - 1, now.getDate());

    // Total users
    const totalUsersResult = await this.pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Users created today
    const todayUsersResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= $1',
      [today]
    );
    const todayUsers = parseInt(todayUsersResult.rows[0].count);

    // Users created this week
    const weekUsersResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= $1',
      [weekAgo]
    );
    const weekUsers = parseInt(weekUsersResult.rows[0].count);

    // Users created this month
    const monthUsersResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= $1',
      [monthAgo]
    );
    const monthUsers = parseInt(monthUsersResult.rows[0].count);

    // Total credits across all users
    const totalCreditsResult = await this.pool.query('SELECT SUM(credits) as total FROM users');
    const totalCredits = parseInt(totalCreditsResult.rows[0].total || '0');

    // Average credits per user
    const avgCreditsResult = await this.pool.query('SELECT AVG(credits) as average FROM users');
    const avgCredits = parseFloat(avgCreditsResult.rows[0].average || '0');

    // Users with credits > 0
    const usersWithCreditsResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE credits > 0'
    );
    const usersWithCredits = parseInt(usersWithCreditsResult.rows[0].count);

    // Admin users
    const adminUsersResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE is_admin = true'
    );
    const adminUsers = parseInt(adminUsersResult.rows[0].count);

    // Recent activity (users created in last 7 days)
    const recentActivityResult = await this.pool.query(
      'SELECT DATE(created_at) as date, COUNT(*) as count FROM users WHERE created_at >= $1 GROUP BY DATE(created_at) ORDER BY date DESC',
      [weekAgo]
    );

    return {
      totalUsers,
      todayUsers,
      weekUsers,
      monthUsers,
      totalCredits,
      avgCredits: Math.round(avgCredits * 100) / 100,
      usersWithCredits,
      adminUsers,
      recentActivity: recentActivityResult.rows,
      periods: {
        today: {
          users: todayUsers,
          percentage: totalUsers > 0 ? Math.round((todayUsers / totalUsers) * 100) : 0
        },
        week: {
          users: weekUsers,
          percentage: totalUsers > 0 ? Math.round((weekUsers / totalUsers) * 100) : 0
        },
        month: {
          users: monthUsers,
          percentage: totalUsers > 0 ? Math.round((monthUsers / totalUsers) * 100) : 0
        }
      }
    };
  }

  async getAnalyticsByPeriod(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        throw new Error('Invalid period');
    }

    const usersResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at >= $1',
      [startDate]
    );
    const users = parseInt(usersResult.rows[0].count);

    const creditsResult = await this.pool.query(
      'SELECT SUM(credits) as total FROM users WHERE created_at >= $1',
      [startDate]
    );
    const credits = parseInt(creditsResult.rows[0].total || '0');

    return {
      period,
      users,
      credits,
      startDate: startDate.toISOString(),
      endDate: now.toISOString()
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

const postgresDb = new PostgresDatabase();

export const userService = {
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    const existing = await postgresDb.getUserByEmail(email);
    if (existing) throw new Error('User with this email already exists');

    const id = crypto.randomUUID();
    const password_hash = await bcrypt.hash(password, 10);
    const created = await postgresDb.createUser({
      id,
      email,
      name,
      password_hash,
      credits: 0,
      is_admin: false,
    } as any);
    return sanitizeUser(created);
  },

  async login(email: string, password: string) {
    const user = await postgresDb.getUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('Invalid credentials');
    return sanitizeUser(user);
  },

  async getUserById(id: string) {
    const user = await postgresDb.getUserById(id);
    if (!user) throw new Error('User not found');
    return sanitizeUser(user);
  },

  async getUserByEmail(email: string) {
    const user = await postgresDb.getUserByEmail(email);
    return user ? sanitizeUser(user) : null;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const updated = await postgresDb.updateUser(id, updates);
    if (!updated) throw new Error('User not found');
    return sanitizeUser(updated);
  },

  async updateCredits(id: string, credits: number) {
    const updated = await postgresDb.updateUserCredits(id, credits);
    if (!updated) throw new Error('User not found');
    return sanitizeUser(updated);
  },

  async deductVideoCredits(id: string) {
    const user = await postgresDb.getUserById(id);
    if (!user) throw new Error('User not found');
    if (user.credits < 50) throw new Error('Insufficient credits. You need 50 credits to generate a video.');
    const updated = await postgresDb.updateUserCredits(id, user.credits - 50);
    if (!updated) throw new Error('Failed to deduct credits');
    return sanitizeUser(updated);
  },

  async deduct3DModelCredits(id: string) {
    const user = await postgresDb.getUserById(id);
    if (!user) throw new Error('User not found');
    if (user.credits < 50) throw new Error('Insufficient credits. You need 50 credits to generate a 3D model.');
    const updated = await postgresDb.updateUserCredits(id, user.credits - 50);
    if (!updated) throw new Error('Failed to deduct credits');
    return sanitizeUser(updated);
  },

  async getAllUsers() {
    const users = await postgresDb.getAllUsers();
    return users.map(sanitizeUser);
  },

  async deleteUser(id: string) {
    return postgresDb.deleteUser(id);
  },

  async getAnalytics() {
    return postgresDb.getAnalytics();
  },

  async getAnalyticsByPeriod(period: string) {
    return postgresDb.getAnalyticsByPeriod(period);
  },

  async verifyPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password_hash);
  },

  async checkEmailExists(email: string) {
    const res = await pool.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1', [email]);
    return res.rowCount > 0;
  }
};

export default postgresDb;
