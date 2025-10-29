require('dotenv').config();
const mysql = require('mysql2/promise');

async function createSettingsTable() {
  console.log('🏗️  Creating website settings table...\n');
  
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database');

    // Create website_settings table
    console.log('📋 Creating website_settings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS website_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        setting_type ENUM('text', 'textarea', 'url', 'image', 'email', 'phone', 'json') DEFAULT 'text',
        category VARCHAR(50) DEFAULT 'general',
        display_name VARCHAR(255),
        description TEXT,
        is_editable BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Website settings table created');

    // Insert default settings
    console.log('📊 Inserting default website settings...');
    
    const defaultSettings = [
      // Site Identity
      ['site_name', 'Soul Trip Tours & Travels', 'text', 'identity', 'Site Name', 'Main website name'],
      ['site_tagline', 'Discover Amazing Adventures', 'text', 'identity', 'Site Tagline', 'Website tagline/slogan'],
      ['site_logo', '/logo/soul-trip-logo.png', 'image', 'identity', 'Site Logo', 'Main website logo'],
      ['site_favicon', '/favicon.ico', 'image', 'identity', 'Site Favicon', 'Website favicon'],
      
      // Contact Information
      ['contact_email', 'info@soultriptours.com', 'email', 'contact', 'Contact Email', 'Main contact email address'],
      ['contact_phone', '+1 (555) 123-4567', 'phone', 'contact', 'Contact Phone', 'Main contact phone number'],
      ['contact_address', '123 Adventure Street, Travel City, TC 12345', 'textarea', 'contact', 'Contact Address', 'Physical business address'],
      
      // Social Media
      ['social_facebook', 'https://facebook.com/soultriptours', 'url', 'social', 'Facebook URL', 'Facebook page URL'],
      ['social_instagram', 'https://instagram.com/soultriptours', 'url', 'social', 'Instagram URL', 'Instagram profile URL'],
      ['social_twitter', 'https://twitter.com/soultriptours', 'url', 'social', 'Twitter URL', 'Twitter profile URL'],
      ['social_youtube', 'https://youtube.com/soultriptours', 'url', 'social', 'YouTube URL', 'YouTube channel URL'],
      
      // Homepage Content
      ['hero_title', 'Travel Your Heart Out', 'text', 'homepage', 'Hero Title', 'Main hero section title'],
      ['hero_subtitle', 'Small group adventures that bring the world closer. Discover breathtaking destinations with expert guides and unforgettable experiences.', 'textarea', 'homepage', 'Hero Subtitle', 'Hero section subtitle/description'],
      ['hero_background', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2835&q=80', 'image', 'homepage', 'Hero Background', 'Hero section background image'],
      
      // About Section
      ['about_title', 'Why Travel with Soul Trip', 'text', 'about', 'About Section Title', 'About section main title'],
      ['about_description', 'We create extraordinary travel experiences that connect you with the world\'s most amazing destinations.', 'textarea', 'about', 'About Description', 'About section description'],
      
      // Footer Content
      ['footer_description', 'Your trusted partner for unforgettable adventures around the world. We create memories that last a lifetime.', 'textarea', 'footer', 'Footer Description', 'Footer description text'],
      ['footer_copyright', '© 2025 Soul Trip Tours & Travels. All rights reserved.', 'text', 'footer', 'Copyright Text', 'Footer copyright text'],
      
      // SEO Settings
      ['meta_description', 'Discover amazing destinations with Soul Trip Tours and Travels. Expert guides, small groups, unforgettable experiences.', 'textarea', 'seo', 'Meta Description', 'Default meta description for SEO'],
      ['meta_keywords', 'travel, tours, adventures, destinations, guided tours, travel agency', 'textarea', 'seo', 'Meta Keywords', 'Default meta keywords for SEO'],
      
      // Business Settings
      ['business_hours', '{"monday":"9:00 AM - 6:00 PM","tuesday":"9:00 AM - 6:00 PM","wednesday":"9:00 AM - 6:00 PM","thursday":"9:00 AM - 6:00 PM","friday":"9:00 AM - 6:00 PM","saturday":"10:00 AM - 4:00 PM","sunday":"Closed"}', 'json', 'business', 'Business Hours', 'Weekly business hours'],
      ['emergency_contact', '+1 (555) 911-HELP', 'phone', 'business', 'Emergency Contact', '24/7 emergency contact number'],
      
      // Email Settings
      ['notification_email', 'admin@soultriptours.com', 'email', 'system', 'Notification Email', 'Email for system notifications'],
      ['booking_confirmation_subject', 'Booking Confirmation - Soul Trip Tours', 'text', 'system', 'Booking Email Subject', 'Subject for booking confirmation emails']
    ];

    for (const [key, value, type, category, displayName, description] of defaultSettings) {
      await connection.execute(`
        INSERT IGNORE INTO website_settings 
        (setting_key, setting_value, setting_type, category, display_name, description) 
        VALUES (?, ?, ?, ?, ?, ?)
      `, [key, value, type, category, displayName, description]);
    }

    console.log('✅ Default settings inserted');

    // Verify the data
    const [settings] = await connection.execute('SELECT * FROM website_settings ORDER BY category, sort_order');
    console.log(`\n📋 Created ${settings.length} website settings:`);
    
    const categories = {};
    settings.forEach(setting => {
      if (!categories[setting.category]) categories[setting.category] = [];
      categories[setting.category].push(setting.display_name);
    });

    Object.keys(categories).forEach(category => {
      console.log(`\n📂 ${category.toUpperCase()}:`);
      categories[category].forEach(name => {
        console.log(`   • ${name}`);
      });
    });

    console.log('\n🎉 Website settings system created successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createSettingsTable();
