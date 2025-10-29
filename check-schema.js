require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkSchema() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    console.log('📋 Current tours table structure:');
    const [columns] = await connection.execute('DESCRIBE tours');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key} ${col.Default || ''}`);
    });

    console.log('\n📋 Checking if tour_highlights table exists:');
    try {
      const [tables] = await connection.execute("SHOW TABLES LIKE 'tour_highlights'");
      if (tables.length > 0) {
        console.log('  ✅ tour_highlights table exists');
        const [highlightCols] = await connection.execute('DESCRIBE tour_highlights');
        highlightCols.forEach(col => {
          console.log(`    ${col.Field}: ${col.Type}`);
        });
      } else {
        console.log('  ❌ tour_highlights table does NOT exist');
      }
    } catch (error) {
      console.log('  ❌ tour_highlights table does NOT exist');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkSchema();
