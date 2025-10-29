const http = require('http');

async function testTourCreation() {
  console.log('🧪 Testing tour creation functionality...\n');
  
  // Test data for creating a new tour
  const newTourData = {
    title: 'Test Antarctic Expedition',
    description: 'Experience the pristine wilderness of Antarctica with our expert polar guides.',
    price: 4999.00,
    duration: '21 days',
    destination: 'Antarctica',
    category_id: 1, // ADVENTURE
    highlights: ['Penguin Colonies', 'Icebergs', 'Polar Research Stations', 'Zodiac Cruising'],
    image: 'antarctica.jpg'
  };

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/tours',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(newTourData))
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ Response Status: ${res.statusCode}`);
          console.log('📄 Response:', response);
          
          if (response.success) {
            console.log('🎉 Tour creation test PASSED!');
            console.log(`📋 New tour ID: ${response.tourId}`);
            
            // Now delete the test tour
            deleteTestTour(response.tourId);
          } else {
            console.log('❌ Tour creation test FAILED:', response.error);
          }
          
          resolve(response);
        } catch (error) {
          console.error('❌ Failed to parse response:', error);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(JSON.stringify(newTourData));
    req.end();
  });
}

async function deleteTestTour(tourId) {
  console.log(`\n🗑️ Deleting test tour ${tourId}...`);
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/admin/tours/${tourId}`,
    method: 'DELETE'
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            console.log('✅ Test tour deleted successfully');
          } else {
            console.log('❌ Failed to delete test tour');
          }
        } catch (error) {
          console.log('❌ Error parsing delete response');
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Delete request error:', error);
      resolve();
    });

    req.end();
  });
}

testTourCreation().catch(console.error);
