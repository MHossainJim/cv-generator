const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const { OAuth2Client } = require('google-auth-library');

// Load configuration
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const client = new OAuth2Client(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

// In-memory session storage (replace with proper session management in production)
const sessions = new Map();

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Helper function to serve static files
function serveStaticFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Helper function to generate session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route: Home page
  if (pathname === '/' || pathname === '/index.html') {
    serveStaticFile('./index.html', res);
  }
  
  // Route: Get Google OAuth URL
  else if (pathname === '/auth/google/url' && req.method === 'GET') {
    const authUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email']
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ url: authUrl }));
  }
  
  // Route: Google OAuth callback
  else if (pathname === '/auth/google/callback' && req.method === 'GET') {
    const code = parsedUrl.query.code;
    
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing authorization code');
      return;
    }

    try {
      // Exchange code for tokens
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      // Get user info
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: config.google.clientId
      });
      const payload = ticket.getPayload();

      // Create session
      const sessionId = generateSessionId();
      sessions.set(sessionId, {
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        }
      });

      // Redirect to form page with session
      res.writeHead(302, {
        'Location': `/form.html?session=${sessionId}`,
        'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly`
      });
      res.end();
    } catch (error) {
      console.error('OAuth error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Authentication failed');
    }
  }
  
  // Route: Get user session
  else if (pathname === '/api/session' && req.method === 'GET') {
    const sessionId = parsedUrl.query.session || getCookie(req.headers.cookie, 'sessionId');
    const session = sessions.get(sessionId);

    if (session) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user: session.user }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not authenticated' }));
    }
  }
  
  // Route: Save portfolio data
  else if (pathname === '/api/save-portfolio' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const sessionId = parsedUrl.query.session || getCookie(req.headers.cookie, 'sessionId');
      const session = sessions.get(sessionId);

      if (!session) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not authenticated' }));
        return;
      }

      try {
        const portfolioData = JSON.parse(body);
        session.portfolioData = portfolioData;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid data' }));
      }
    });
  }
  
  // Route: Get portfolio data
  else if (pathname === '/api/get-portfolio' && req.method === 'GET') {
    const sessionId = parsedUrl.query.session || getCookie(req.headers.cookie, 'sessionId');
    const session = sessions.get(sessionId);

    if (!session) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not authenticated' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: session.portfolioData || {} }));
  }
  
  // Route: Static files
  else if (pathname.startsWith('/public/')) {
    serveStaticFile(`.${pathname}`, res);
  }
  
  // Route: Form page
  else if (pathname === '/form.html') {
    serveStaticFile('./form.html', res);
  }
  
  // Route: CV template page
  else if (pathname === '/cv-template.html') {
    serveStaticFile('./cv-template.html', res);
  }
  
  // 404 Not Found
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Helper function to parse cookies
function getCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }
  return null;
}

// Start server
server.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}/`);
  console.log('Make sure to configure Google OAuth credentials in config.json');
});
