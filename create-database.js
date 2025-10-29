require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  console.log('🚀 Creating database...\n');
  
  let connection;
  
  try {
    // Connect without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, '')
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`✅ Database '${process.env.DB_NAME}' created successfully!`);

    // Switch to the new database
    await connection.execute(`USE ${process.env.DB_NAME}`);
    console.log(`✅ Using database '${process.env.DB_NAME}'`);

    console.log('\n🎉 Database creation completed successfully!');
    
  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();
