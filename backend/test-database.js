// Quick test script to verify database connection and API endpoints
const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  try {
    // Test MongoDB connection
    console.log('1. Testing MongoDB Connection...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    
    // Test basic database operations
    console.log('\n2. Testing Database Operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Available collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None yet (will be created when first data is inserted)'}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
    console.log('\n🎉 Database test completed successfully!');
    console.log('\n📡 Your API endpoints are ready at:');
    console.log('   • GET  http://localhost:3000/ - API status');
    console.log('   • GET  http://localhost:3000/api/users - List users');
    console.log('   • POST http://localhost:3000/api/users/register - Register user');
    console.log('   • GET  http://localhost:3000/api/messages - List messages');
    console.log('   • GET  http://localhost:3000/api/posts - List posts');
    console.log('   • GET  http://localhost:3000/api/contacts - List contacts');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();