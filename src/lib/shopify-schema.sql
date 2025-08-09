-- Shopify Orders Table
CREATE TABLE IF NOT EXISTS shopify_orders (
  id VARCHAR(255) PRIMARY KEY,
  shopify_order_id BIGINT UNIQUE NOT NULL,
  order_number VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  total_price DECIMAL(10,2) NOT NULL,
  subtotal_price DECIMAL(10,2) NOT NULL,
  total_tax DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  financial_status VARCHAR(50) NOT NULL,
  fulfillment_status VARCHAR(50),
  order_status VARCHAR(50) NOT NULL,
  checkout_id BIGINT,
  checkout_token VARCHAR(255),
  cart_token VARCHAR(255),
  user_id VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancelled_reason VARCHAR(255),
  tags TEXT,
  note TEXT,
  gateway VARCHAR(100),
  source_name VARCHAR(100),
  source_identifier VARCHAR(255),
  device_id BIGINT,
  browser_ip VARCHAR(45),
  landing_site VARCHAR(500),
  landing_site_ref VARCHAR(255),
  referring_site VARCHAR(500),
  user_agent TEXT,
  location_id BIGINT,
  shipping_address JSONB,
  billing_address JSONB,
  line_items JSONB,
  shipping_lines JSONB,
  discount_codes JSONB,
  tax_lines JSONB,
  payment_details JSONB,
  refunds JSONB,
  customer_locale VARCHAR(10),
  app_id BIGINT,
  browser_ip VARCHAR(45),
  landing_site VARCHAR(500),
  landing_site_ref VARCHAR(255),
  referring_site VARCHAR(500),
  user_agent TEXT,
  location_id BIGINT,
  shipping_address JSONB,
  billing_address JSONB,
  line_items JSONB,
  shipping_lines JSONB,
  discount_codes JSONB,
  tax_lines JSONB,
  payment_details JSONB,
  refunds JSONB,
  customer_locale VARCHAR(10),
  app_id BIGINT
);

-- Shopify Transactions Table
CREATE TABLE IF NOT EXISTS shopify_transactions (
  id VARCHAR(255) PRIMARY KEY,
  shopify_transaction_id BIGINT UNIQUE NOT NULL,
  order_id VARCHAR(255) REFERENCES shopify_orders(id),
  shopify_order_id BIGINT NOT NULL,
  kind VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  gateway VARCHAR(100),
  source_name VARCHAR(100),
  source_identifier VARCHAR(255),
  device_id BIGINT,
  browser_ip VARCHAR(45),
  landing_site VARCHAR(500),
  landing_site_ref VARCHAR(255),
  referring_site VARCHAR(500),
  user_agent TEXT,
  location_id BIGINT,
  shipping_address JSONB,
  billing_address JSONB,
  line_items JSONB,
  shipping_lines JSONB,
  discount_codes JSONB,
  tax_lines JSONB,
  payment_details JSONB,
  refunds JSONB,
  customer_locale VARCHAR(10),
  app_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  error_code VARCHAR(100),
  error_message TEXT,
  receipt JSONB,
  authorization VARCHAR(255),
  parent_id BIGINT,
  test BOOLEAN DEFAULT FALSE
);

-- Shopify Checkout Sessions Table (for tracking abandoned carts)
CREATE TABLE IF NOT EXISTS shopify_checkout_sessions (
  id VARCHAR(255) PRIMARY KEY,
  shopify_checkout_id BIGINT UNIQUE NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  cart_token VARCHAR(255),
  user_id VARCHAR(255) REFERENCES users(id),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  total_price DECIMAL(10,2),
  subtotal_price DECIMAL(10,2),
  total_tax DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  line_items JSONB,
  shipping_address JSONB,
  billing_address JSONB,
  discount_codes JSONB,
  tax_lines JSONB,
  payment_details JSONB,
  customer_locale VARCHAR(10),
  app_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  abandoned_at TIMESTAMP,
  expires_at TIMESTAMP,
  source_name VARCHAR(100),
  source_identifier VARCHAR(255),
  device_id BIGINT,
  browser_ip VARCHAR(45),
  landing_site VARCHAR(500),
  landing_site_ref VARCHAR(255),
  referring_site VARCHAR(500),
  user_agent TEXT,
  location_id BIGINT
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shopify_orders_created_at ON shopify_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_customer_email ON shopify_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_financial_status ON shopify_orders(financial_status);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_user_id ON shopify_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shopify_orders_total_price ON shopify_orders(total_price);

CREATE INDEX IF NOT EXISTS idx_shopify_transactions_order_id ON shopify_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_shopify_transactions_created_at ON shopify_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_shopify_transactions_kind ON shopify_transactions(kind);
CREATE INDEX IF NOT EXISTS idx_shopify_transactions_status ON shopify_transactions(status);
CREATE INDEX IF NOT EXISTS idx_shopify_transactions_amount ON shopify_transactions(amount);

CREATE INDEX IF NOT EXISTS idx_shopify_checkout_sessions_token ON shopify_checkout_sessions(token);
CREATE INDEX IF NOT EXISTS idx_shopify_checkout_sessions_user_id ON shopify_checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_shopify_checkout_sessions_customer_email ON shopify_checkout_sessions(customer_email);
CREATE INDEX IF NOT EXISTS idx_shopify_checkout_sessions_created_at ON shopify_checkout_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_shopify_checkout_sessions_completed_at ON shopify_checkout_sessions(completed_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shopify_orders_updated_at BEFORE UPDATE ON shopify_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopify_transactions_updated_at BEFORE UPDATE ON shopify_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopify_checkout_sessions_updated_at BEFORE UPDATE ON shopify_checkout_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
