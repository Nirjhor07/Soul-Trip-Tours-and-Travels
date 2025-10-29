const mysql = require('mysql2/promise');
require('dotenv').config();

async function addValuesContent() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'soultrip'
  });

  try {
    console.log('📝 Adding Values section content to database...\n');

    // Add Values section title and subtitle
    const valuesToAdd = [
      ['values_title', 'Values Title', 'Our Values', null, 7],
      ['values_subtitle', 'Values Subtitle', 'These core principles guide everything we do and shape the way we approach travel.', null, 8]
    ];

    for (const [key, title, content, image, order] of valuesToAdd) {
      const [existing] = await connection.execute(
        'SELECT id FROM about_content WHERE section_key = ?',
        [key]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO about_content (section_key, section_title, content, image_url, order_index) VALUES (?, ?, ?, ?, ?)',
          [key, title, content, image, order]
        );
        console.log(`✅ Added: ${key} - ${title}`);
      } else {
        console.log(`ℹ️  Already exists: ${key}`);
      }
    }

    // Create a new table for values/principles
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS about_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(100),
        order_index INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Created about_values table');

    // Add the individual values
    const values = [
      ['Authentic Experiences', 'We believe in genuine connections and authentic cultural exchanges that go beyond typical tourist experiences.', 'fas fa-heart', 1],
      ['Responsible Tourism', 'Every trip is designed to benefit local communities and minimize environmental impact while maximizing positive change.', 'fas fa-leaf', 2],
      ['Community Focus', 'We work closely with local communities to ensure our tours provide meaningful economic benefits and cultural exchange.', 'fas fa-users', 3],
      ['Excellence', 'We\'re committed to delivering exceptional service and unforgettable experiences that exceed expectations.', 'fas fa-star', 4],
      ['Safety First', 'Your safety and security are our top priorities. We maintain the highest safety standards in all our operations.', 'fas fa-shield-alt', 5],
      ['Trust & Transparency', 'We believe in honest communication, fair pricing, and transparent business practices in all our dealings.', 'fas fa-handshake', 6]
    ];

    for (const [title, description, icon, order] of values) {
      const [existing] = await connection.execute(
        'SELECT id FROM about_values WHERE title = ?',
        [title]
      );

      if (existing.length === 0) {
        await connection.execute(
          'INSERT INTO about_values (title, description, icon, order_index) VALUES (?, ?, ?, ?)',
          [title, description, icon, order]
        );
        console.log(`✅ Added value: ${title}`);
      } else {
        console.log(`ℹ️  Value already exists: ${title}`);
      }
    }

    // Update the order of existing content to make room
    await connection.execute(`
      UPDATE about_content 
      SET order_index = order_index + 2 
      WHERE section_key IN ('team_title', 'team_subtitle', 'cta_title', 'cta_content')
    `);

    console.log('✅ Updated content ordering');

    // Check final result
    const [finalContent] = await connection.execute(`
      SELECT section_key, section_title 
      FROM about_content 
      WHERE is_active = 1 
      ORDER BY order_index
    `);

    console.log('\n📋 Final content sections:');
    finalContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.section_key} - ${item.section_title}`);
    });

    const [valuesCount] = await connection.execute('SELECT COUNT(*) as count FROM about_values WHERE is_active = 1');
    console.log(`\n🎯 Total values/principles: ${valuesCount[0].count}`);

  } catch (error) {
    console.error('❌ Error adding values content:', error);
  } finally {
    await connection.end();
  }
}

addValuesContent();
