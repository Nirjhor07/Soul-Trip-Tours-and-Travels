const http = require('http');

async function revertTour() {
  console.log('🔄 Reverting tour to original state...\n');
  
  // Original data for tour ID 1
  const originalData = {
    title: 'Himalayan Adventure Trek',
    description: 'Experience the breathtaking beauty of the Himalayas with our expert guides.',
    price: 1899.00,
    duration: '15 days',
    destination: 'Nepal',
    category_id: 1,
    highlights: ['Everest Base Camp', 'Sherpa Culture', 'Mountain Views', 'Ancient Monasteries'],
    image: 'himalayas.jpg'
  };

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/tours/1',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(originalData))
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
            console.log('🎉 Tour reverted successfully!');
          } else {
            console.log('❌ Tour revert failed:', response.error);
          }
          
          resolve(response);
        } catch (error) {
          console.error('❌ Failed to parse response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(JSON.stringify(originalData));
    req.end();
  });
}

revertTour().catch(console.error);
