const http = require('http');
const url = require('url');

// Test routes
const testRoutes = [
  { path: '/', name: 'Homepage' },
  { path: '/tours', name: 'Tours Page' },
  { path: '/tour/1', name: 'Tour Details' },
  { path: '/about', name: 'About Page' },
  { path: '/contact', name: 'Contact Page' },
  { path: '/admin/login', name: 'Admin Login' },
  { path: '/admin/dashboard', name: 'Admin Dashboard' },
  { path: '/admin/tours', name: 'Admin Tours' },
  { path: '/api/admin/stats', name: 'API Stats' },
  { path: '/api/admin/tours', name: 'API Tours' }
];

async function testRoute(route) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: route.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Test-Agent'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          ...route,
          status: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          contentLength: data.length
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        ...route,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        ...route,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function testWebsite() {
  console.log('🌐 Testing website functionality...\n');
  
  const results = [];
  
  for (const route of testRoutes) {
    console.log(`Testing ${route.name}...`);
    const result = await testRoute(route);
    results.push(result);
    
    if (result.success) {
      console.log(`   ✅ ${result.status} - ${result.contentLength} bytes`);
    } else {
      console.log(`   ❌ ${result.status} - ${result.error || 'Failed'}`);
    }
  }
  
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`   Successful routes: ${successful}/${total}`);
  
  if (successful === total) {
    console.log('   🎉 All routes are working correctly!');
  } else {
    console.log('   ⚠️  Some routes have issues:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`      - ${r.name}: ${r.status}`);
    });
  }
  
  console.log('\n✅ Website functionality test completed!');
}

testWebsite().catch(console.error);
