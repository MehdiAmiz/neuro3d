const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'nexodusai',
  host: 'localhost',
  database: 'nexodusai',
  port: 5432,
});

async function testDatabase() {
  try {
    console.log('🧪 Testing PostgreSQL Database...\n');

    // Test 1: Connection
    console.log('1. Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0]);
    console.log('');

    // Test 2: Get all users
    console.log('2. Testing get all users...');
    const users = await pool.query('SELECT id, email, name, credits, is_admin FROM users ORDER BY created_at DESC');
    console.log('✅ Users found:', users.rows.length);
    users.rows.forEach(user => {
      console.log(`   - ${user.name} (${user.email}): ${user.credits} credits, Admin: ${user.is_admin}`);
    });
    console.log('');

    // Test 3: Update user credits
    console.log('3. Testing credit update...');
    const updateResult = await pool.query(
      'UPDATE users SET credits = 7500 WHERE email = $1 RETURNING id, email, credits',
      ['testuser@example.com']
    );
    if (updateResult.rows.length > 0) {
      console.log('✅ Credits updated:', updateResult.rows[0]);
    } else {
      console.log('⚠️ No user found to update');
    }
    console.log('');

    // Test 4: Add new user
    console.log('4. Testing create new user...');
    const newUserId = 'test-' + Date.now();
    const insertResult = await pool.query(
      'INSERT INTO users (id, email, name, password_hash, credits, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, credits',
      [newUserId, 'newuser@example.com', 'New Test User', '$2b$10$9yS6mfrwgRRrUUaTgFKEAeelx4ju0XiItjkEsP7emtZN4zNOv2Vvi', 3000, false]
    );
    console.log('✅ New user created:', insertResult.rows[0]);
    console.log('');

    // Test 5: Get user by email
    console.log('5. Testing get user by email...');
    const userByEmail = await pool.query('SELECT id, email, name, credits FROM users WHERE email = $1', ['newuser@example.com']);
    if (userByEmail.rows.length > 0) {
      console.log('✅ User found by email:', userByEmail.rows[0]);
    } else {
      console.log('❌ User not found');
    }
    console.log('');

    // Test 6: Delete test user
    console.log('6. Testing delete user...');
    const deleteResult = await pool.query('DELETE FROM users WHERE email = $1 RETURNING id, email', ['newuser@example.com']);
    if (deleteResult.rows.length > 0) {
      console.log('✅ User deleted:', deleteResult.rows[0]);
    } else {
      console.log('⚠️ No user to delete');
    }
    console.log('');

    // Test 7: Final user count
    console.log('7. Final user count...');
    const finalCount = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Total users in database:', finalCount.rows[0].count);
    console.log('');

    console.log('🎉 All database tests completed successfully!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();
