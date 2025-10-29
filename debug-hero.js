require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkHeroSettings() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD.replace(/"/g, ''),
    database: process.env.DB_NAME
  });

  try {
    console.log('Checking hero-related settings in database...');
    const [rows] = await connection.execute('SELECT setting_key, setting_value, category FROM website_settings WHERE setting_key LIKE "%hero%" OR setting_key LIKE "%subtitle%"');
    
    if (rows.length === 0) {
      console.log('No hero or subtitle settings found!');
      console.log('Let me check all homepage category settings...');
      const [homepageRows] = await connection.execute('SELECT setting_key, setting_value FROM website_settings WHERE category = "homepage"');
      console.log('Homepage settings:');
      homepageRows.forEach(row => {
        console.log(`- ${row.setting_key}: ${row.setting_value}`);
      });
    } else {
      console.log('Hero/subtitle settings found:');
      rows.forEach(row => {
        console.log(`- ${row.setting_key}: ${row.setting_value} (${row.category})`);
      });
    }
    
    // Also check what template settings are being loaded
    console.log('\n=== All settings for template ===');
    const [allRows] = await connection.execute('SELECT setting_key, setting_value FROM website_settings ORDER BY category, setting_key');
    allRows.forEach(row => {
      console.log(`${row.setting_key} = "${row.setting_value}"`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkHeroSettings();
