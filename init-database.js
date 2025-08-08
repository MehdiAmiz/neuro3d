const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: 'nexodusai',
  host: 'localhost',
  database: 'nexodusai',
  password: '', // No password for local development
  port: 5432,
});

async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL database');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'src/lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('✅ Database schema initialized successfully!');
    
    // Create a test admin user if none exists
    const existingUsers = await pool.query('SELECT * FROM users');
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
      console.log(`✅ Found ${existingUsers.rows.length} existing users`);
    }
    
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('✅ Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  });
