require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up Soul Trip Tours Database...\n');
  
  try {
    // Create connection to MySQL server (without selecting database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' created/verified`);

    // Close initial connection and reconnect to the specific database
    await connection.end();
    
    // Reconnect to the specific database
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log(`✅ Connected to database '${process.env.DB_NAME}'`);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      console.log('📋 Creating database tables...');
      await dbConnection.query(schemaSql);
      console.log('✅ Database schema created successfully');
    } else {
      console.log('⚠️  Schema file not found, skipping table creation');
    }

    // Check if we need to seed data
    const [rows] = await dbConnection.execute('SELECT COUNT(*) as count FROM tours');
    const tourCount = rows[0].count;

    if (tourCount === 0) {
      console.log('📊 No tours found, importing seed data...');
      
      // Read and execute seed.sql
      const seedPath = path.join(__dirname, 'database', 'seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await dbConnection.query(seedSql);
        console.log('✅ Seed data imported successfully');
      } else {
        console.log('⚠️  Seed file not found, skipping data import');
      }
    } else {
      console.log(`ℹ️  Found ${tourCount} existing tours, skipping seed data`);
    }

    // Verify the setup
    console.log('\n🔍 Verifying database setup...');
    
    // Check tables
    const [tables] = await dbConnection.execute('SHOW TABLES');
    console.log(`✅ Created ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });

    // Check tour data
    const [tourData] = await dbConnection.execute(`
      SELECT 
        t.title, 
        c.name as category, 
        t.price 
      FROM tours t 
      LEFT JOIN categories c ON t.category_id = c.id 
      LIMIT 3
    `);
    
    console.log('\n📋 Sample tour data:');
    tourData.forEach(tour => {
      console.log(`   - ${tour.title} (${tour.category}) - $${tour.price}`);
    });

    await dbConnection.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update your server.js to use database instead of static data');
    console.log('   2. Test the application with: npm run dev');
    console.log('   3. Create admin panel for tour management');

  } catch (error) {
    console.error('❌ Database setup failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check your database credentials in .env file');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check your DB_USER and DB_PASSWORD in .env file');
      console.log('   - Make sure the user has permission to create databases');
    }
  }
}

// Run the setup
setupDatabase();