// Basic test to verify server setup
// You can expand this with proper testing frameworks like Jest later

const testEndpoints = async () => {
  const baseURL = 'http://localhost:5000';
  
  console.log('🧪 Testing API endpoints...\n');
  
  try {
    // Test server health
    console.log('1. Testing server health...');
    const response = await fetch(`${baseURL}/`);
    const data = await response.json();
    console.log('✅ Server is running:', data.message);
    
    // Test user registration (example)
    console.log('\n2. Example user registration test...');
    console.log('POST /api/users/register');
    console.log('Body: { username, email, password, firstName, lastName }');
    
    // Test message creation (example)
    console.log('\n3. Example message creation test...');
    console.log('POST /api/messages');
    console.log('Body: { title, content, author, category }');
    
    console.log('\n✨ Basic setup verified! Check README.md for full API documentation.\n');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    console.log('Make sure the server is running: npm run dev');
  }
};

// Uncomment the line below to run the test (make sure server is running first)
// testEndpoints();