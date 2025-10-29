require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateTourImages() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    console.log('🔄 Updating tour images with proper URLs...\n');
    
    // Keep tour 1 as is (it has an uploaded image)
    // Update the rest with proper Unsplash URLs
    const imageUpdates = [
      { id: 2, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'African Safari Experience' },
      { id: 3, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Mystical India Journey' },
      { id: 4, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'European Grand Tour' },
      { id: 5, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Amazon Rainforest Expedition' },
      { id: 6, image: 'https://images.unsplash.com/photo-1552733407-6d4c3b2ef16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Southeast Asian Discovery' }
    ];

    for (const update of imageUpdates) {
      await connection.execute(
        'UPDATE tours SET image = ? WHERE id = ?',
        [update.image, update.id]
      );
      console.log(`✅ Updated ${update.title} with new image URL`);
    }

    console.log('\n🎉 All tour images updated successfully!');

    // Verify the updates
    const [tours] = await connection.execute('SELECT id, title, image FROM tours ORDER BY id');
    
    console.log('\n📋 Current tour images:');
    tours.forEach(tour => {
      console.log(`${tour.id}. ${tour.title}`);
      console.log(`   Image: ${tour.image.length > 50 ? tour.image.substring(0, 50) + '...' : tour.image}`);
      console.log(`   Type: ${tour.image.startsWith('http') ? 'External URL' : 'Local file'}`);
      console.log('   ' + '─'.repeat(50));
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateTourImages();
