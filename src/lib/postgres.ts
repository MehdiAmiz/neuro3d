import { Pool } from 'pg';

// Database configuration
const pool = new Pool({
  user: 'nexodusai',
  host: 'localhost',
  database: 'nexodusai',
  password: '', // No password for local development
  port: 5432,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
