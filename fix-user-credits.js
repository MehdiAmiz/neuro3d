// Simple script to check and fix test user credits
const { userService } = require('./src/lib/database.ts');

async function fixUserCredits() {
  try {
    // Find the test user
    const user = await userService.findUserByEmail('test@example.com');
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('Current user credits:', user.credits);
    
    // Reset to 10000 credits
    const updatedUser = await userService.updateCredits(user.id, 10000);
    console.log('✅ User credits reset to:', updatedUser.credits);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixUserCredits();
