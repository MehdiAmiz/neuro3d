INSERT INTO users (id, email, name, password_hash, credits, is_admin) 
VALUES (
  'test-user-123', 
  'testuser@example.com', 
  'Test User', 
  '$2b$10$9yS6mfrwgRRrUUaTgFKEAeelx4ju0XiItjkEsP7emtZN4zNOv2Vvi', 
  5000, 
  false
);
