-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  credits INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  google_id VARCHAR(255) UNIQUE,
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Optional index for Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Prevent extremely long names/emails
ALTER TABLE IF EXISTS users
  ALTER COLUMN email TYPE VARCHAR(255),
  ALTER COLUMN name TYPE VARCHAR(255);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Alter table for deployments that already created the table without new columns
-- Make password_hash nullable for OAuth users
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    BEGIN
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    EXCEPTION WHEN others THEN NULL;
    END;
  END IF;
END $$;

-- Add google_id column if missing
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
-- Ensure uniqueness if not present (ignore errors if it already exists)
DO $$
BEGIN
  BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS users_google_id_unique ON users(google_id);
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;

-- Add avatar_url column if missing
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Add email_verified column if missing
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
