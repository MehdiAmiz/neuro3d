import { userService } from '../src/lib/database';

async function main() {
  try {
    const user = await userService.findUserByEmail('test@example.com');
    if (!user) {
      console.error('❌ Test User not found');
      process.exit(1);
    }
    const updated = await userService.updateCredits(user.id, 100);
    console.log(`✅ Updated credits for ${updated.email} to ${updated.credits}`);
  } catch (err) {
    console.error('❌ Failed to update credits:', err);
    process.exit(1);
  }
}

main();
