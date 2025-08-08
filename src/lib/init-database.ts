import fs from 'fs';
import path from 'path';
import postgresDb from './postgres-database';

async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Initialize database connection
    await postgresDb.init();
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await postgresDb.pool.query(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      }
    }
    
    console.log('Database schema initialized successfully!');
    
    // Create a test admin user if none exists
    const existingUsers = await postgresDb.getAllUsers();
    if (existingUsers.length === 0) {
      console.log('Creating initial admin user...');
      const { userService } = await import('./postgres-database');
      
      await userService.createUser(
        'admin@nexodusai.com',
        'Admin User',
        'admin123'
      );
      
      // Make the first user admin
      await postgresDb.updateUser(existingUsers[0]?.id || '', { is_admin: true });
      console.log('Initial admin user created: admin@nexodusai.com / admin123');
    }
    
    console.log('Database initialization complete!');
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

export default initializeDatabase;
