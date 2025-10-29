require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTables() {
  console.log('🚀 Creating database tables step by step...\n');
  
  let connection;
  
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD.replace(/"/g, ''),
      database: process.env.DB_NAME
    });

    console.log('✅ Connected to database');

    // Create categories table
    console.log('📋 Creating categories table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert categories
    console.log('📋 Inserting categories...');
    await connection.execute(`
      INSERT IGNORE INTO categories (id, name, description) VALUES 
      (1, 'ADVENTURE', 'Thrilling adventures for adrenaline seekers'),
      (2, 'CULTURAL', 'Immersive cultural experiences and heritage tours'),
      (3, 'WILDLIFE', 'Wildlife safaris and nature encounters'),
      (4, 'NATURE', 'Natural wonders and eco-tourism'),
      (5, 'CLASSIC', 'Classic destinations and timeless experiences')
    `);

    // Create tours table
    console.log('📋 Creating tours table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category_id INT NOT NULL,
        description TEXT NOT NULL,
        route VARCHAR(255),
        highlights TEXT,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Create bookings table
    console.log('📋 Creating bookings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tour_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20),
        preferred_date DATE,
        participants INT NOT NULL DEFAULT 1,
        total_cost DECIMAL(10, 2),
        status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id)
      )
    `);

    // Create contact inquiries table
    console.log('📋 Creating contact_inquiries table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('New', 'Read', 'Replied') DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created successfully!');

    // Check if tours already exist
    const [existingTours] = await connection.execute('SELECT COUNT(*) as count FROM tours');
    
    if (existingTours[0].count === 0) {
      console.log('📊 Inserting tour data...');
      
      // Insert tours one by one
      const tours = [
        {
          id: 1,
          title: 'Himalayan Adventure Trek',
          destination: 'Nepal',
          duration: '15 days',
          price: 1899.00,
          image: 'himalayas.jpg',
          category_id: 1,
          description: 'Experience the breathtaking beauty of the Himalayas with our expert guides.',
          route: 'Kathmandu to Everest Base Camp',
          highlights: 'Everest Base Camp,Sherpa Culture,Mountain Views,Ancient Monasteries'
        },
        {
          id: 2,
          title: 'African Safari Experience',
          destination: 'Kenya & Tanzania',
          duration: '12 days',
          price: 2499.00,
          image: 'safari.jpg',
          category_id: 3,
          description: 'Witness the Great Migration and explore the wild heart of Africa.',
          route: 'Nairobi to Serengeti',
          highlights: 'Big Five,Great Migration,Maasai Culture,Serengeti'
        },
        {
          id: 3,
          title: 'Mystical India Journey',
          destination: 'India',
          duration: '14 days',
          price: 1699.00,
          image: 'india.jpg',
          category_id: 2,
          description: 'Discover the rich heritage and diverse culture of incredible India.',
          route: 'Delhi to Mumbai',
          highlights: 'Taj Mahal,Rajasthan Palaces,Spiritual Sites,Local Cuisine'
        },
        {
          id: 4,
          title: 'European Grand Tour',
          destination: 'Europe',
          duration: '21 days',
          price: 3299.00,
          image: 'europe.jpg',
          category_id: 5,
          description: 'Explore the historic cities and cultural treasures of Europe.',
          route: 'London to Rome',
          highlights: 'Historic Cities,Art Museums,Local Cuisine,Architecture'
        },
        {
          id: 5,
          title: 'Amazon Rainforest Expedition',
          destination: 'Brazil',
          duration: '10 days',
          price: 2199.00,
          image: 'amazon.jpg',
          category_id: 4,
          description: 'Dive deep into the world\'s largest rainforest ecosystem.',
          route: 'Manaus to Iquitos',
          highlights: 'Wildlife Spotting,River Cruises,Indigenous Culture,Biodiversity'
        },
        {
          id: 6,
          title: 'Southeast Asian Discovery',
          destination: 'Thailand & Vietnam',
          duration: '18 days',
          price: 2099.00,
          image: 'southeast-asia.jpg',
          category_id: 2,
          description: 'Experience the vibrant cultures and stunning landscapes of Southeast Asia.',
          route: 'Bangkok to Ho Chi Minh City',
          highlights: 'Ancient Temples,Street Food,Floating Markets,Beach Relaxation'
        }
      ];

      for (const tour of tours) {
        await connection.execute(`
          INSERT INTO tours 
          (id, title, destination, duration, price, image, category_id, description, route, highlights, featured) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          tour.id, tour.title, tour.destination, tour.duration, tour.price, 
          tour.image, tour.category_id, tour.description, tour.route, tour.highlights,
          tour.id <= 3 ? true : false // First 3 tours are featured
        ]);
      }

      console.log('✅ Tour data inserted successfully!');
    } else {
      console.log(`ℹ️  Found ${existingTours[0].count} existing tours, skipping insertion`);
    }

    // Verify data
    console.log('\n🔍 Verifying database...');
    
    const [categories] = await connection.execute('SELECT * FROM categories');
    console.log(`✅ Categories: ${categories.length}`);
    
    const [tours] = await connection.execute('SELECT * FROM tours');
    console.log(`✅ Tours: ${tours.length}`);

    console.log('\n📋 Sample tours:');
    for (const tour of tours.slice(0, 3)) {
      console.log(`   - ${tour.title} ($${tour.price})`);
    }

    console.log('\n🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTables();