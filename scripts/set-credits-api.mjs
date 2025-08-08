const API = 'http://localhost:8080/api';

async function main() {
  try {
    const usersRes = await fetch(`${API}/admin/users`);
    const usersJson = await usersRes.json();
    if (!usersJson.success) throw new Error('Failed to fetch users');
    const testUser = usersJson.users.find(u => u.email === 'test@example.com');
    if (!testUser) throw new Error('Test User not found');

    const updRes = await fetch(`${API}/users/${testUser.id}/credits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credits: 100 })
    });
    const updJson = await updRes.json();
    if (!updRes.ok) throw new Error(updJson.error || 'Update failed');

    console.log(`✅ Updated ${updJson.user.email} credits to ${updJson.user.credits}`);
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    process.exit(1);
  }
}

main();
