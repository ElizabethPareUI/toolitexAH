const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`${method} ${path}`);
  
  // Handle different routes
  if (path === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'API funcionando', status: 'OK' }));
  } else if (path === '/api/auth/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { name, email, password } = JSON.parse(body);
        console.log('Register request:', { name, email, password: '***' });
        
        // Simple validation
        if (!name || !email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Todos los campos son requeridos' }));
          return;
        }
        
        // Return success response
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          _id: '123',
          name,
          email,
          isAdmin: false,
          token: 'mock-token-123'
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
  } else if (path === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        console.log('Login request:', { email, password: '***' });
        
        // Simple validation
        if (!email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Email y contraseña son requeridos' }));
          return;
        }
        
        // Return success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          _id: '123',
          name: 'Test User',
          email,
          isAdmin: false,
          token: 'mock-token-123'
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
  } else {
    // Handle 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: `Route ${method} ${path} not found`,
      availableRoutes: [
        'GET /',
        'POST /api/auth/register',
        'POST /api/auth/login'
      ]
    }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Available routes:`);
  console.log(`  GET http://localhost:${PORT}/`);
  console.log(`  POST http://localhost:${PORT}/api/auth/register`);
  console.log(`  POST http://localhost:${PORT}/api/auth/login`);
});
