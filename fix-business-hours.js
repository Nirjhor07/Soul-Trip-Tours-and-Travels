const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixBusinessHours() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'soul_trip_tours'
    });

    console.log('🔧 Fixing business_hours setting type...');
    
    // Update the setting type from JSON to text
    await connection.execute(`
      UPDATE website_settings 
      SET setting_type = 'text' 
      WHERE setting_key = 'business_hours'
    `);
    
    console.log('✅ Business hours setting type updated to text');
    
    // Verify the update
    const [rows] = await connection.execute(`
      SELECT setting_key, setting_type, setting_value 
      FROM website_settings 
      WHERE setting_key = 'business_hours'
    `);
    
    console.log('📋 Current business_hours setting:', rows[0]);
    
    await connection.end();
    console.log('🎉 Database update complete!');
    
  } catch (error) {
    console.error('❌ Error fixing business hours:', error);
  }
}

fixBusinessHours();
