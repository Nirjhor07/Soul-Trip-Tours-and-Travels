const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMissionVisionData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'soultrip'
  });

  try {
    console.log('🔍 Checking Mission and Vision content in database...\n');

    // Check for mission and vision related content
    const [content] = await connection.execute(`
      SELECT section_key, section_title, content, is_active 
      FROM about_content 
      WHERE section_key LIKE '%mission%' OR section_key LIKE '%vision%' OR section_key LIKE '%story%'
      ORDER BY order_index
    `);
    
    if (content.length > 0) {
      console.log('✅ Found Mission/Vision related content:');
      content.forEach((item, index) => {
        console.log(`\n${index + 1}. Section Key: ${item.section_key}`);
        console.log(`   Title: ${item.section_title}`);
        console.log(`   Active: ${item.is_active ? 'Yes' : 'No'}`);
        console.log(`   Content: ${item.content}`);
        console.log('   ' + '─'.repeat(80));
      });
    } else {
      console.log('❌ No mission/vision content found in database');
    }

    // Check all content sections to see what we have
    console.log('\n📋 All content sections in database:');
    const [allContent] = await connection.execute(`
      SELECT section_key, section_title, is_active 
      FROM about_content 
      ORDER BY order_index
    `);
    
    allContent.forEach((item, index) => {
      const status = item.is_active ? '✅' : '❌';
      console.log(`${status} ${index + 1}. ${item.section_key} - "${item.section_title}"`);
    });

    // Check if values section exists (which contains mission-like content)
    console.log('\n🎯 Checking for Values section content...');
    const [valuesContent] = await connection.execute(`
      SELECT section_key, section_title, content 
      FROM about_content 
      WHERE section_key LIKE '%values%' OR section_title LIKE '%values%'
    `);

    if (valuesContent.length > 0) {
      console.log('✅ Found Values related content:');
      valuesContent.forEach(item => {
        console.log(`   ${item.section_key}: ${item.section_title}`);
        console.log(`   Content: ${item.content}`);
      });
    } else {
      console.log('ℹ️  No specific Values sections found - they might be hardcoded in the template');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await connection.end();
  }
}

checkMissionVisionData();
