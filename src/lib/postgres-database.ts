import pool from './postgres';
import bcrypt from 'bcryptjs';

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

export class PostgresDatabase {
  private pool = pool;

  async init(): Promise<void> {
    try {
      // Test connection
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
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at');
    if (fields.length === 0) return this.getUserById(id);

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const values = [id, ...fields.map(field => updates[field as keyof User])];
    const result = await this.pool.query(query, values);
    return result.rows[0] || null;
  }

  async updateUserCredits(id: string, credits: number): Promise<User | null> {
    const query = 'UPDATE users SET credits = $2 WHERE id = $1 RETURNING *';
    const result = await this.pool.query(query, [id, credits]);
    return result.rows[0] || null;
  }

  async getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async deleteUser(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Create singleton instance
const postgresDb = new PostgresDatabase();

// User service functions
export const userService = {
  async createUser(email: string, name: string, password: string): Promise<User> {
    const id = crypto.randomUUID();
    const password_hash = await bcrypt.hash(password, 10);
    
    return postgresDb.createUser({
      id,
      email,
      name,
      password_hash,
      credits: 10000,
      is_admin: false
    });
  },

  async getUserById(id: string): Promise<User | null> {
    return postgresDb.getUserById(id);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return postgresDb.getUserByEmail(email);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return postgresDb.updateUser(id, updates);
  },

  async updateUserCredits(id: string, credits: number): Promise<User | null> {
    return postgresDb.updateUserCredits(id, credits);
  },

  async getAllUsers(): Promise<User[]> {
    return postgresDb.getAllUsers();
  },

  async deleteUser(id: string): Promise<boolean> {
    return postgresDb.deleteUser(id);
  },

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }
};

export default postgresDb;
