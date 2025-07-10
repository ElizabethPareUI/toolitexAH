const https = require('https');
const http = require('http');

function testAPI() {
  console.log('Testing API endpoints...');
  
  // Test the root endpoint
  const testEndpoint = (url, data = null) => {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: data ? 'POST' : 'GET',
        headers: data ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data))
        } : {}
      };

      const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(`${options.method} ${url} -> ${res.statusCode}`);
          console.log('Response:', body);
          resolve({ statusCode: res.statusCode, body });
        });
      });

      req.on('error', (err) => {
        console.error(`Error testing ${url}:`, err.message);
        reject(err);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  };

  // Test localhost:3001
  testEndpoint('http://localhost:3001/')
    .then(() => testEndpoint('http://localhost:3001/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123'
    }))
    .catch(err => console.error('Test failed:', err));
}

testAPI();
