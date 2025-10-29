const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabaseContent() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'soultrip'
  });

  try {
    console.log('📋 About Content Sections:');
    const [content] = await connection.execute(`
      SELECT section_key, section_title, LEFT(content, 80) as content_preview 
      FROM about_content 
      WHERE is_active = 1 
      ORDER BY order_index
    `);
    
    content.forEach((item, index) => {
      console.log(`${index + 1}. ${item.section_key}: "${item.section_title}"`);
      console.log(`   Content: ${item.content_preview}...`);
      console.log('');
    });

    console.log('👥 Team Members:');
    const [team] = await connection.execute(`
      SELECT name, position, LEFT(bio, 60) as bio_preview 
      FROM about_team 
      WHERE is_active = 1 
      ORDER BY order_index
    `);
    
    team.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name} - ${member.position}`);
      console.log(`   Bio: ${member.bio_preview}...`);
      console.log('');
    });

    console.log('📊 Statistics:');
    const [stats] = await connection.execute(`
      SELECT stat_key, stat_value, stat_label 
      FROM about_stats 
      WHERE is_active = 1 
      ORDER BY order_index
    `);
    
    stats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.stat_key}: ${stat.stat_value} - ${stat.stat_label}`);
    });

    console.log('\n✅ All About page data is stored in the database!');
    console.log('📝 Total content sections:', content.length);
    console.log('👥 Total team members:', team.length);
    console.log('📊 Total statistics:', stats.length);

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await connection.end();
  }
}

checkDatabaseContent();
