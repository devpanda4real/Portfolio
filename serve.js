/**
 * Imesh Kaushalya — Cloud Computing & Systems Portfolio
 * Zero-dependency local preview server & API controller.
 * Auto-opens browser and handles privacy/auth controls.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

// Configuration
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8080;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'ecosystem-settings.json');

// Super Admin Configuration (Credentials must come from environment or settings)
const SUPER_ADMIN_PIN = (process.env.SUPER_ADMIN_PIN || '').trim();
const SUPER_ADMIN_KEY = (process.env.SUPER_ADMIN_KEY || '').trim().toLowerCase();
const SUPER_ADMIN_COOKIE = 'imesh_admin_session';

// In-memory active session tokens (cryptographically random)
const activeSessions = new Set();

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Privacy & Visibility Settings (All sensitive personal data private by default)
const defaultSettings = {
  showPhoneNumber: false,
  showWhatsApp: false,
  showRefereePhone: false,
  recruiterInquiryOnly: true,
  lastUpdated: new Date().toISOString()
};

function getSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return { ...defaultSettings, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')) };
    }
  } catch (e) {
    console.warn('[Settings] Failed to read settings file:', e.message);
  }
  return { ...defaultSettings };
}

function saveSettings(settings) {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf8');
    return updated;
  } catch (e) {
    console.error('[Settings] Failed to save settings:', e.message);
    return null;
  }
}

function getPublicSettings() {
  const s = getSettings();
  return {
    showPhoneNumber: Boolean(s.showPhoneNumber),
    showWhatsApp: Boolean(s.showWhatsApp),
    showRefereePhone: Boolean(s.showRefereePhone),
    recruiterInquiryOnly: Boolean(s.recruiterInquiryOnly),
    lastUpdated: s.lastUpdated || new Date().toISOString()
  };
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name ? name.trim() : '';
    if (!name) return;
    list[name] = decodeURIComponent(rest.join('=').trim());
  });
  return list;
}

function isSuperAdmin(req) {
  // 1. Check verified session cookie against active in-memory session tokens
  const cookies = parseCookies(req);
  const cookieToken = cookies[SUPER_ADMIN_COOKIE];
  if (cookieToken && activeSessions.has(cookieToken)) {
    return true;
  }

  // 2. Check Authorization header against active session tokens
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (bearerToken && activeSessions.has(bearerToken)) {
      return true;
    }
  }

  // URL query parameters are permanently disabled for security
  return false;
}

function parseJsonBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:8080'}`);
  let reqPath = decodeURIComponent(parsedUrl.pathname);

  // Default routes
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // ----------------------------------------------------------------------------
  // REST API: Admin Settings
  // ----------------------------------------------------------------------------
  // Helper: Strict Origin CORS & Security Headers (No Wildcards)
  function applyCors(res) {
    const origin = req.headers.origin;
    const host = req.headers.host || `localhost:${currentPort}`;
    const allowed = [
      `http://${host}`,
      `http://localhost:${currentPort}`,
      `http://127.0.0.1:${currentPort}`
    ];
    if (origin && allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  }

  // ----------------------------------------------------------------------------
  // REST API: Public Settings (Safe booleans only, zero secrets)
  // ----------------------------------------------------------------------------
  if (reqPath === '/api/public/settings' || reqPath === '/api/admin/settings') {
    applyCors(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    if (req.method === 'GET') {
      const authenticated = isSuperAdmin(req);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({
        success: true,
        settings: getPublicSettings(),
        isSuperAdmin: authenticated
      }));
    }

    if (req.method === 'POST') {
      if (!isSuperAdmin(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          success: false,
          error: 'Unauthorized: Valid Super Admin session required.'
        }));
      }

      parseJsonBody(req).then(body => {
        // Whitelist allowed settings keys to prevent arbitrary pollution
        const allowedPatch = {};
        if (typeof body.showPhoneNumber === 'boolean') allowedPatch.showPhoneNumber = body.showPhoneNumber;
        if (typeof body.showWhatsApp === 'boolean') allowedPatch.showWhatsApp = body.showWhatsApp;
        if (typeof body.showRefereePhone === 'boolean') allowedPatch.showRefereePhone = body.showRefereePhone;
        if (typeof body.recruiterInquiryOnly === 'boolean') allowedPatch.recruiterInquiryOnly = body.recruiterInquiryOnly;
        if (typeof body.customAdminPassword === 'string' && body.customAdminPassword.trim().length >= 6) {
          allowedPatch.customAdminPassword = body.customAdminPassword.trim();
        }

        const updated = saveSettings(allowedPatch);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          success: true,
          message: 'Privacy settings updated successfully',
          settings: getPublicSettings()
        }));
      });
      return;
    }
  }

  // ----------------------------------------------------------------------------
  // REST API: Super Admin Authentication (Session Cookie Based)
  // ----------------------------------------------------------------------------
  if (reqPath === '/api/auth/login' && req.method === 'POST') {
    applyCors(res);
    parseJsonBody(req).then(body => {
      const pin = (body.pin || body.password || '').trim();
      const settings = getSettings();
      const customPass = (settings.customAdminPassword || '').trim();

      let authenticated = false;
      if (SUPER_ADMIN_PIN && pin === SUPER_ADMIN_PIN) {
        authenticated = true;
      } else if (SUPER_ADMIN_KEY && pin.toLowerCase() === SUPER_ADMIN_KEY) {
        authenticated = true;
      } else if (customPass && pin === customPass) {
        authenticated = true;
      }

      if (authenticated) {
        // Generate a cryptographically secure random session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        activeSessions.add(sessionToken);

        res.setHeader('Set-Cookie', `${SUPER_ADMIN_COOKIE}=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          success: true,
          role: 'Super Admin',
          name: 'Imesh Kaushalya'
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          success: false,
          error: 'Invalid Super Admin credentials. Access denied.'
        }));
      }
    });
    return;
  }

  if (reqPath === '/api/auth/status') {
    applyCors(res);
    const authenticated = isSuperAdmin(req);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      authenticated,
      role: authenticated ? 'Super Admin' : 'Visitor',
      user: authenticated ? 'Imesh Kaushalya' : 'Guest'
    }));
  }

  if (reqPath === '/api/auth/logout') {
    applyCors(res);
    const cookies = parseCookies(req);
    const currentToken = cookies[SUPER_ADMIN_COOKIE];
    if (currentToken) {
      activeSessions.delete(currentToken);
    }
    res.setHeader('Set-Cookie', `${SUPER_ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ success: true, message: 'Logged out successfully' }));
  }

  // ----------------------------------------------------------------------------
  // Static File Serving & Privacy Gate
  // ----------------------------------------------------------------------------
  // Direct HTTP requests to internal data directory are strictly forbidden for all callers
  if (reqPath.startsWith('/data/')) {
    res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      success: false,
      error: '403 Forbidden: Internal configuration directory is protected.'
    }));
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  // If a production dist build exists, prefer serving from dist
  const distPath = path.join(PUBLIC_DIR, 'dist', safePath);
  if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
    filePath = distPath;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#0b0f19;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h1>404 — Page Not Found</h1><p><a href="/" style="color:#38bdf8;">Return to Portfolio</a></p></body></html>`);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

let currentPort = DEFAULT_PORT;

// Extract CLI parameters
const portArg = process.argv.find(a => a.startsWith('--port='));
if (portArg) {
  currentPort = parseInt(portArg.split('=')[1], 10) || DEFAULT_PORT;
}

function startServer(port) {
  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n╔═══════════════════════════════════════════════════════════════════╗`);
    console.log(`║               🚀  IMESH KAUSHALYA — CLOUD PORTFOLIO               ║`);
    console.log(`║          Cloud Computing Undergraduate • SLTC Research Univ        ║`);
    console.log(`╠═══════════════════════════════════════════════════════════════════╣`);
    console.log(`║                                                                   ║`);
    console.log(`║   🌐 Public Portfolio:  ${url.padEnd(41)} ║`);
    console.log(`║   🔒 Admin Access:      Protected (Sign in via UI or CLI)     ║`);
    console.log(`║                                                                   ║`);
    console.log(`║   Press Ctrl+C to stop server.                                    ║`);
    console.log(`╚═══════════════════════════════════════════════════════════════════╝\n`);

    // Auto-open browser (prefer Microsoft Edge on Windows if requested)
    if (!process.argv.includes('--no-open')) {
      const openCmd = process.platform === 'win32'
        ? `start msedge "${url}"`
        : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
      exec(openCmd, (err) => {
        if (err && process.platform === 'win32') {
          // Fallback to system default browser if msedge command fails
          exec(`start "" "${url}"`, () => {});
        }
      });
    }
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    currentPort++;
    console.log(`[!] Port ${currentPort - 1} is in use, trying port ${currentPort}...`);
    startServer(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);
