const Database = require('./models/Database.js');

async function checkSettings() {
  try {
    const db = new Database();
    const rows = await db.query('SELECT setting_key, setting_value, updated_at FROM website_settings ORDER BY updated_at DESC');
    
    console.log('=== Current Database Settings (ordered by most recent updates) ===');
    rows.forEach(row => {
      console.log(`${row.setting_key}: ${row.setting_value}`);
      console.log(`  Last updated: ${row.updated_at}`);
      console.log('---');
    });
    
    console.log(`\nTotal settings found: ${rows.length}`);
    
    await db.close();
  } catch (error) {
    console.error('Error checking settings:', error);
  } finally {
    process.exit(0);
  }
}

checkSettings();
