require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD.replace(/"/g, ''),
    database: process.env.DB_NAME
  });

  try {
    console.log('Checking website_settings table structure...');
    
    const [columns] = await connection.execute('DESCRIBE website_settings');
    console.log('Current columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key ? `KEY: ${col.Key}` : ''} ${col.Default !== null ? `DEFAULT: ${col.Default}` : ''}`);
    });

    // Check if we have any data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM website_settings');
    console.log(`\nRows in table: ${rows[0].count}`);

    if (rows[0].count > 0) {
      const [sample] = await connection.execute('SELECT * FROM website_settings LIMIT 3');
      console.log('\nSample data:');
      sample.forEach(row => {
        console.log(`- ${row.setting_key}: ${row.setting_value} (${row.category})`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkTable();
