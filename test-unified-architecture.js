#!/usr/bin/env node

// Test script for the unified architecture
// Using built-in fetch (available in Node.js 18+)

const API_BASE_URL = 'http://localhost:8080/api';
const SERVER_URL = 'http://localhost:8080';

async function testUnifiedArchitecture() {
  console.log('🧪 Testing Unified Architecture...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${SERVER_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: Register User
    console.log('2️⃣ Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@unified.com',
        password: 'password123'
      })
    });
    
    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      console.log('❌ Registration failed with status:', registerResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    const registerData = await registerResponse.json();
    console.log('✅ User Registration:', registerData.user);
    const userId = registerData.user.id;
    console.log('');

    // Test 3: Login User
    console.log('3️⃣ Testing User Login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@unified.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed with status:', loginResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ User Login:', loginData.user);
    console.log('');

    // Test 4: Add Credits
    console.log('4️⃣ Testing Credit Addition...');
    const addCreditsResponse = await fetch(`${API_BASE_URL}/users/${userId}/credits/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creditsToAdd: 1000 })
    });
    
    if (!addCreditsResponse.ok) {
      const errorText = await addCreditsResponse.text();
      console.log('❌ Credit addition failed with status:', addCreditsResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    const creditsData = await addCreditsResponse.json();
    console.log('✅ Credit Addition:', {
      oldCredits: creditsData.oldCredits,
      newCredits: creditsData.newCredits,
      added: creditsData.newCredits - creditsData.oldCredits
    });
    console.log('');

    // Test 5: Deduct Video Credits
    console.log('5️⃣ Testing Video Credit Deduction...');
    const deductVideoResponse = await fetch(`${API_BASE_URL}/users/${userId}/credits/deduct-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!deductVideoResponse.ok) {
      const errorText = await deductVideoResponse.text();
      console.log('❌ Video credit deduction failed with status:', deductVideoResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    const deductData = await deductVideoResponse.json();
    console.log('✅ Video Credit Deduction:', {
      remainingCredits: deductData.user.credits
    });
    console.log('');

    // Test 6: Get All Users (Admin)
    console.log('6️⃣ Testing Get All Users...');
    const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
    
    if (!usersResponse.ok) {
      const errorText = await usersResponse.text();
      console.log('❌ Get all users failed with status:', usersResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    const usersData = await usersResponse.json();
    console.log('✅ Get All Users:', {
      totalUsers: usersData.users.length,
      users: usersData.users.map(u => ({ id: u.id, email: u.email, credits: u.credits }))
    });
    console.log('');

    // Test 7: Simulate Webhook
    console.log('7️⃣ Testing Webhook Simulation...');
    const webhookResponse = await fetch(`${SERVER_URL}/webhooks/shopify/order-paid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        financial_status: 'paid',
        note_attributes: [
          { name: 'userId', value: userId },
          { name: 'credits', value: '500' }
        ]
      })
    });
    
    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.log('❌ Webhook processing failed with status:', webhookResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    console.log('✅ Webhook Processing: Success');
    console.log('');

    // Test 8: Verify Credits After Webhook
    console.log('8️⃣ Verifying Credits After Webhook...');
    const finalUserResponse = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (!finalUserResponse.ok) {
      const errorText = await finalUserResponse.text();
      console.log('❌ Get final user failed with status:', finalUserResponse.status);
      console.log('❌ Error response:', errorText);
      return;
    }

    const finalUserData = await finalUserResponse.json();
    console.log('✅ Final User Credits:', finalUserData.user.credits);

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }

  console.log('\n🎉 Unified Architecture Test Complete!');
}

// Check if server is running before testing
async function checkServer() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    if (response.ok) {
      console.log('✅ Server is running, starting tests...\n');
      await testUnifiedArchitecture();
    } else {
      console.log('❌ Server is not responding properly');
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the unified server first:');
    console.log('   npm run server:unified');
  }
}

checkServer();
