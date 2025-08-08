const fetch = require('node-fetch');

const API_BASE = 'http://127.0.0.1:3000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test 2: Register new user
    console.log('2. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpass123'
      })
    });
    
    if (registerResponse.ok) {
      const userData = await registerResponse.json();
      console.log('✅ User registered:', userData);
      const userId = userData.user.id;
      console.log('');

      // Test 3: Get user by ID
      console.log('3. Testing get user by ID...');
      const getUserResponse = await fetch(`${API_BASE}/users/${userId}`);
      const getUserData = await getUserResponse.json();
      console.log('✅ Get user:', getUserData);
      console.log('');

      // Test 4: Update user credits
      console.log('4. Testing credit update...');
      const updateCreditsResponse = await fetch(`${API_BASE}/users/${userId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: 5000 })
      });
      const updateCreditsData = await updateCreditsResponse.json();
      console.log('✅ Credits updated:', updateCreditsData);
      console.log('');

      // Test 5: Add credits
      console.log('5. Testing add credits...');
      const addCreditsResponse = await fetch(`${API_BASE}/users/${userId}/credits/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditsToAdd: 1000 })
      });
      const addCreditsData = await addCreditsResponse.json();
      console.log('✅ Credits added:', addCreditsData);
      console.log('');

      // Test 6: Deduct video credits
      console.log('6. Testing deduct video credits...');
      const deductVideoResponse = await fetch(`${API_BASE}/users/${userId}/credits/deduct-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const deductVideoData = await deductVideoResponse.json();
      console.log('✅ Video credits deducted:', deductVideoData);
      console.log('');

      // Test 7: Deduct 3D model credits
      console.log('7. Testing deduct 3D model credits...');
      const deduct3DResponse = await fetch(`${API_BASE}/users/${userId}/credits/deduct-3d`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const deduct3DData = await deduct3DResponse.json();
      console.log('✅ 3D model credits deducted:', deduct3DData);
      console.log('');

    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData);
    }

    // Test 8: Get all users (admin endpoint)
    console.log('8. Testing get all users...');
    const allUsersResponse = await fetch(`${API_BASE}/admin/users`);
    const allUsersData = await allUsersResponse.json();
    console.log('✅ All users:', allUsersData);
    console.log('');

    // Test 9: Check email exists
    console.log('9. Testing email check...');
    const emailCheckResponse = await fetch(`${API_BASE}/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser@example.com' })
    });
    const emailCheckData = await emailCheckResponse.json();
    console.log('✅ Email check:', emailCheckData);
    console.log('');

    console.log('🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();
