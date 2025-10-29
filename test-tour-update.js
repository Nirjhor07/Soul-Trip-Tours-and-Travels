const http = require('http');

async function testTourUpdate() {
  console.log('🧪 Testing tour update functionality...\n');
  
  // Test data for updating tour ID 1
  const updateData = {
    title: 'Updated Himalayan Adventure Trek',
    description: 'Experience the breathtaking beauty of the Himalayas with our expert guides. Updated description!',
    price: 1999.00,
    duration: '16 days',
    destination: 'Nepal & Tibet',
    category_id: 1,
    highlights: ['Everest Base Camp', 'Sherpa Culture', 'Mountain Views', 'Ancient Monasteries', 'Updated Highlight'],
    image: 'himalayas.jpg'
  };

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/tours/1',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(updateData))
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
            console.log('🎉 Tour update test PASSED!');
          } else {
            console.log('❌ Tour update test FAILED:', response.error);
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

    req.write(JSON.stringify(updateData));
    req.end();
  });
}

testTourUpdate().catch(console.error);
