require('dotenv').config();
const mysql = require('mysql2/promise');

async function showTourDetails() {
  console.log('🗂️  Displaying all tour details from database...\n');
  
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    const [tours] = await connection.execute(`
      SELECT 
        t.*,
        c.name as category_name
      FROM tours t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.id
    `);

    console.log(`📋 Found ${tours.length} tours in the database:\n`);

    tours.forEach((tour, index) => {
      console.log(`${index + 1}. 🎯 ${tour.title}`);
      console.log(`   📍 Destination: ${tour.destination}`);
      console.log(`   ⏱️  Duration: ${tour.duration}`);
      console.log(`   💰 Price: $${tour.price}`);
      console.log(`   🏷️  Category: ${tour.category_name}`);
      console.log(`   🖼️  Image: ${tour.image}`);
      console.log(`   📝 Description: ${tour.description}`);
      console.log(`   🗺️  Route: ${tour.route}`);
      console.log(`   ⭐ Featured: ${tour.featured ? 'Yes' : 'No'}`);
      console.log(`   📊 Status: ${tour.status}`);
      if (tour.highlights) {
        console.log(`   🎯 Highlights: ${tour.highlights}`);
      }
      console.log('   ' + '─'.repeat(60));
    });

    // Also show categories
    const [categories] = await connection.execute('SELECT * FROM categories ORDER BY id');
    console.log('\n📂 Available Categories:');
    categories.forEach(cat => {
      console.log(`   ${cat.id}. ${cat.name} - ${cat.description}`);
    });

    console.log('\n✅ Tour data display completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

showTourDetails();
