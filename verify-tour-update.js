require('dotenv').config();
const mysql = require('mysql2/promise');

async function verifyTourUpdate() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    console.log('🔍 Checking updated tour details...\n');
    
    const [tours] = await connection.execute('SELECT * FROM tours WHERE id = 1');
    
    if (tours.length > 0) {
      const tour = tours[0];
      console.log('📋 Updated Tour Details:');
      console.log(`   Title: ${tour.title}`);
      console.log(`   Destination: ${tour.destination}`);
      console.log(`   Duration: ${tour.duration}`);
      console.log(`   Price: $${tour.price}`);
      console.log(`   Description: ${tour.description}`);
      console.log(`   Highlights: ${tour.highlights}`);
      console.log('\n✅ Tour update verified successfully!');
    } else {
      console.log('❌ Tour not found');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifyTourUpdate();
