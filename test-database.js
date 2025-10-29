require('dotenv').config();
const TourService = require('./services/TourService');

async function testDatabase() {
  console.log('🧪 Testing database connection and data...\n');
  
  const tourService = new TourService();
  
  try {
    console.log('✅ TourService initialized');
    
    // Test getting all tours
    console.log('📋 Fetching all tours...');
    const tours = await tourService.getAllTours();
    console.log(`✅ Found ${tours.length} tours:`);
    
    tours.forEach((tour, index) => {
      console.log(`   ${index + 1}. ${tour.title} - $${tour.price} (${tour.destination})`);
    });
    
    // Test getting tours by category
    console.log('\n📋 Testing category filtering...');
    const adventureTours = await tourService.getToursByCategory('ADVENTURE');
    console.log(`✅ Found ${adventureTours.length} adventure tours`);
    
    const culturalTours = await tourService.getToursByCategory('CULTURAL');
    console.log(`✅ Found ${culturalTours.length} cultural tours`);
    
    // Test getting specific tour
    if (tours.length > 0) {
      console.log('\n📋 Testing single tour fetch...');
      const firstTour = await tourService.getTourById(tours[0].id);
      console.log(`✅ Fetched tour: ${firstTour.title}`);
      console.log(`   Highlights: ${firstTour.highlights.join(', ')}`);
    }
    
    console.log('\n🎉 All database tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error(error);
  } finally {
    await tourService.close();
    console.log('🔒 Database connection closed');
  }
}

testDatabase();
