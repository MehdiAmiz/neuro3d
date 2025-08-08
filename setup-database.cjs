const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration with password
const pool = new Pool({
  user: 'nexodusai',
  host: 'localhost',
  database: 'nexodusai',
  password: 'nexodusai123',
  port: 5432,
});

async function setupDatabase() {
  try {
    console.log('Setting up PostgreSQL database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        credits INTEGER DEFAULT 10000,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created users table');
    
    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    console.log('✅ Created email index');
    
    // Create trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
    console.log('✅ Created trigger function');
    
    // Create trigger
    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `);
    console.log('✅ Created trigger');
    
    // Check if admin user exists
    const existingUsers = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@nexodusai.com']);
    
    if (existingUsers.rows.length === 0) {
      console.log('Creating initial admin user...');
      
      const bcrypt = require('bcryptjs');
      const password_hash = await bcrypt.hash('admin123', 10);
      
      await pool.query(`
        INSERT INTO users (id, email, name, password_hash, credits, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        'admin-' + Date.now(),
        'admin@nexodusai.com',
        'Admin User',
        password_hash,
        10000,
        true
      ]);
      
      console.log('✅ Initial admin user created: admin@nexodusai.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to setup database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('✅ Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  });
