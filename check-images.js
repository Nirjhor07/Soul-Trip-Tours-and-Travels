require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTourImages() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    console.log('🖼️  Checking tour images in database...\n');
    
    const [tours] = await connection.execute('SELECT id, title, image FROM tours ORDER BY id');
    
    tours.forEach(tour => {
      console.log(`${tour.id}. ${tour.title}`);
      console.log(`   Image: ${tour.image || 'No image set'}`);
      console.log(`   Type: ${tour.image && tour.image.startsWith('http') ? 'External URL' : 'Local file'}`);
      console.log('   ' + '─'.repeat(50));
    });

    console.log('\n📋 Summary:');
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Tours with images: ${tours.filter(t => t.image).length}`);
    console.log(`   External URLs: ${tours.filter(t => t.image && t.image.startsWith('http')).length}`);
    console.log(`   Local files: ${tours.filter(t => t.image && !t.image.startsWith('http')).length}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkTourImages();
