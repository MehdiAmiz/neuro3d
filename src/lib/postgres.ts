import { Pool } from 'pg';

// Database configuration (use environment variables in production)
const {
  PGUSER,
  PGPASSWORD,
  PGHOST,
  PGDATABASE,
  PGPORT,
  PGSSL,
} = process.env as Record<string, string | undefined>;

const pool = new Pool({
  user: PGUSER || 'nexodusai',
  password: PGPASSWORD,
  host: PGHOST || '127.0.0.1',
  database: PGDATABASE || 'nexodusai',
  port: PGPORT ? parseInt(PGPORT, 10) : 5432,
  ssl: PGSSL === '1' || PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
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
