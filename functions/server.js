import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  saveInquiryToDb,
  getAllInquiriesFromDb,
  updateInquiryStatusInDb,
  deleteInquiryFromDb,
  getPaletteFromDb,
  savePaletteToDb,
  resetPaletteInDb
} from './server/db.js';
import { sendInquiryNotification } from './server/mailer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Whitelisted domains allowed to communicate with the API
const allowedOrigins = [
  'https://decodeias.com',
  'https://www.decodeias.com',
  'https://d-code-ias.web.app',
  'https://d-code-ias.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or approved domains
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS security policy.'));
  },
  credentials: true
}));

app.use(express.json());

// Essential HTTP Security Headers (Clickjacking & MIME-confusion defense)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Prevents Clickjacking in hidden iframes
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevents MIME type sniffing
  res.setHeader('X-XSS-Protection', '1; mode=block'); // Legacy XSS filter
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// =========================================================================
// SECURITY LAYER: Session Management & Rate Limiting
// =========================================================================

// Active Admin Session Map: token -> { email, role, expiresAt }
const activeAdminSessions = new Map();

// Rate Limiting: IP -> { count, lastAttempt }
const failedLoginAttempts = new Map();
const inquiryRateLimits = new Map();

// Periodic cleanup of expired tokens and old rate limit counters every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeAdminSessions.entries()) {
    if (session.expiresAt < now) {
      activeAdminSessions.delete(token);
    }
  }
  for (const [ip, record] of failedLoginAttempts.entries()) {
    if (now - record.lastAttempt > 15 * 60 * 1000) {
      failedLoginAttempts.delete(ip);
    }
  }
  for (const [ip, record] of inquiryRateLimits.entries()) {
    if (now - record.firstAttempt > 60 * 60 * 1000) {
      inquiryRateLimits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Color validation helper for color palette API
function isValidHexColor(hex) {
  if (!hex || typeof hex !== 'string') return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

// Authentication Middleware to Protect Admin Endpoints
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required to access this resource.'
    });
  }

  const token = authHeader.split(' ')[1];
  const session = activeAdminSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeAdminSessions.delete(token);
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid. Please log in again.'
    });
  }

  req.adminSession = session;
  next();
};

// Input Sanitizer to Prevent Stored XSS and Injection
const sanitizeInput = (val, maxLength = 250) => {
  if (typeof val !== 'string') return '';
  return val
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Strip dangerous HTML tags
};

// =========================================================================
// PUBLIC ENDPOINTS
// =========================================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: "D'code IAS Academy API",
    ownerEmail: process.env.OWNER_EMAIL || 'info@decodeias.com',
    ownerCcEmails: process.env.OWNER_CC_EMAIL || 'dcodesudhagaran@gmail.com,sudhagaransirdcode@gmail.com',
    timestamp: new Date().toISOString()
  });
});

// Full Academy Metadata Endpoint for AI & Search Engines
app.get('/api/metadata', (req, res) => {
  res.json({
    academy: {
      name: "D'code IAS Academy",
      alternateNames: ["Decode IAS Academy", "Decode IAS", "D'code IAS Anna Nagar"],
      tagline: "We Simplify Your IAS Journey",
      founder: "Sudhagaran Sir (Former Mission Director, Naan Mudhalvan)",
      description: "Premier UPSC & TNPSC Civil Services Academy in Anna Nagar, Chennai led by Sudhagaran Sir. Offering Mains Momentum 2027, PCM Comprehensive, Public Administration, Sociology, Anthropology optionals, and TNPSC Group 1, 2 & 4 coaching.",
      contact: {
        phones: ["+91 96000 60393", "+91 96000 60349"],
        emails: ["info@decodeias.com", "dcodesudhagaran@gmail.com", "sudhagaransirdcode@gmail.com"],
        address: "825, 1st St, G Block, Ranganathan Garden, Anna Nagar, Chennai - 600040, Tamil Nadu, India",
        geoCoordinates: { latitude: 13.0850, longitude: 80.2101 }
      },
      social: {
        instagram: "https://www.instagram.com/dcode_ias_academy",
        youtube: "https://www.youtube.com/@DcodeIASAcademy_sudhagaran_sir",
        telegram: "https://t.me/sudhagaranirps",
        whatsApp: "https://chat.whatsapp.com/JaLf2Lf9uMiB1ZKzhrCnGp"
      }
    },
    courses: [
      {
        title: "Mains Momentum 2027",
        duration: "5 Months",
        highlights: "Daily answer writing, personal mentorship under Sudhagaran Sir, mock tests, Ethics & Essay specialization."
      },
      {
        title: "PCM Comprehensive Foundation Course",
        duration: "Full Duration",
        highlights: "Complete UPSC Prelims & Mains foundation for beginners, CSAT, daily test series, integrated mentorship."
      },
      {
        title: "Public Administration Optional",
        duration: "4 Months",
        highlights: "10-year PYQ analysis, concept maps, daily evaluation, high-yield material kits under Sudhagaran Sir."
      },
      {
        title: "Sociology Optional",
        duration: "4 Months",
        highlights: "Structured notes, visual theory mapping, daily answer review, model answers."
      },
      {
        title: "Anthropology Optional",
        duration: "4 Months",
        highlights: "Physical & biological anthropology, diagram tutorials, case study templates, daily evaluation."
      },
      {
        title: "TNPSC Group 1, 2 & 4",
        duration: "Ongoing",
        highlights: "Bilingual Tamil/English coaching, state rank-holder mentors, Unit 8 & Unit 9 focus."
      }
    ],
    freeOffers: [
      "10-Year Solved Mains PYQ Answer Bank",
      "Prelims High-Yield Micro Notes & Mind Maps",
      "Daily Current Affairs & Editorial Breakdown",
      "Free 1-on-1 Mentorship Diagnostic Session with Sudhagaran Sir",
      "Free CSAT Quick Formula Guide",
      "Free UPSC All-India Mock Test Series"
    ],
    topRanks: [
      { name: "Rajeshwari Suve M", rank: "AIR 2", year: 2026 },
      { name: "Rahul Deshmukh", rank: "AIR 12", year: 2025 },
      { name: "Sneha Iyer", rank: "AIR 28", year: 2025 },
      { name: "Vivek Anand", rank: "AIR 45", year: 2025 }
    ]
  });
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: https://decodeias.com/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://decodeias.com/</loc><priority>1.0</priority></url><url><loc>https://decodeias.com/#courses</loc><priority>0.9</priority></url></urlset>`);
});

// =========================================================================
// AUTHENTICATION & LOGIN (Brute-Force Protected)
// =========================================================================

// POST /api/admin/login - Authenticate owner for admin dashboard with rate-limiting
app.post('/api/admin/login', (req, res) => {
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const ipRecord = failedLoginAttempts.get(clientIp) || { count: 0, lastAttempt: Date.now() };

  // Block if more than 5 failed attempts in 15 minutes
  if (ipRecord.count >= 5 && Date.now() - ipRecord.lastAttempt < 15 * 60 * 1000) {
    const minutesLeft = Math.ceil((15 * 60 * 1000 - (Date.now() - ipRecord.lastAttempt)) / 60000);
    return res.status(429).json({
      success: false,
      error: `Too many failed login attempts. Security lock in place. Please retry in ${minutesLeft} minute(s).`
    });
  }

  const { email, password } = req.body;
  const targetEmail = (process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || 'info@decodeias.com').toLowerCase().trim();
  const targetPassword = process.env.ADMIN_PASSWORD || 'dCode#Admin9872!';

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Both Email Address and Password are required.'
    });
  }

  if (email.toLowerCase().trim() === targetEmail && password === targetPassword) {
    // Reset failed attempts on successful login
    failedLoginAttempts.delete(clientIp);

    // Generate cryptographically secure random session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours valid

    activeAdminSessions.set(token, {
      email: targetEmail,
      role: 'Administrator',
      expiresAt
    });

    return res.json({
      success: true,
      token,
      admin: {
        email: targetEmail,
        role: 'Administrator',
        loginTime: new Date().toISOString(),
        expiresAt
      }
    });
  } else {
    // Increment failed attempt counter
    ipRecord.count += 1;
    ipRecord.lastAttempt = Date.now();
    failedLoginAttempts.set(clientIp, ipRecord);

    return res.status(401).json({
      success: false,
      error: 'Invalid admin credentials. Please verify your email and password.'
    });
  }
});

// POST /api/admin/logout - Invalidate and revoke current session token
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminSessions.delete(token);
  }
  res.json({
    success: true,
    message: 'Session token invalidated successfully.'
  });
});

// =========================================================================
// PUBLIC INQUIRY SUBMISSION (Sanitized & Rate Limited)
// =========================================================================

// POST /api/inquiries - Create new lead submission & send email
app.post('/api/inquiries', async (req, res) => {
  try {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const rateRecord = inquiryRateLimits.get(clientIp) || { count: 0, firstAttempt: Date.now() };

    // Limit to 25 form submissions per IP per hour to block automated spam bots
    if (rateRecord.count >= 25 && Date.now() - rateRecord.firstAttempt < 60 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        error: 'Too many submissions from this connection. Please try again later.'
      });
    }

    rateRecord.count += 1;
    inquiryRateLimits.set(clientIp, rateRecord);

    const fullName = sanitizeInput(req.body.fullName, 120);
    const phone = sanitizeInput(req.body.phone, 25);
    const email = sanitizeInput(req.body.email, 120);
    const course = sanitizeInput(req.body.course, 120);
    const formType = sanitizeInput(req.body.formType, 50) || 'contact';
    const message = sanitizeInput(req.body.message, 2500);

    if (!fullName || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Full Name and Phone Number are required fields.'
      });
    }

    // 1. Save to persistent database
    const newRecord = await saveInquiryToDb({
      fullName,
      phone,
      email,
      course,
      formType,
      message
    });

    // 2. Dispatch email to website owner & confirmation to student
    const emailStatus = await sendInquiryNotification(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received and notification dispatched.',
      inquiry: newRecord,
      emailStatus
    });
  } catch (err) {
    console.error('Error processing inquiry endpoint:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while processing lead.'
    });
  }
});

// =========================================================================
// PROTECTED ADMIN ENDPOINTS (Requires Valid Bearer Token)
// =========================================================================

// GET /api/admin/dashboard - Fetch database statistics & aggregated lead metrics
app.get('/api/admin/dashboard', requireAdminAuth, async (req, res) => {
  try {
    const inquiries = await getAllInquiriesFromDb();

    const totalLeads = inquiries.length;
    const enrollmentsCount = inquiries.filter(i => i.formType === 'enrollment').length;
    const registrationsCount = inquiries.filter(i => i.formType === 'registration').length;
    const contactsCount = inquiries.filter(i => !i.formType || i.formType === 'contact' || i.formType === 'inquiry').length;
    const pendingCount = inquiries.filter(i => i.status === 'New').length;
    const contactedCount = inquiries.filter(i => i.status === 'Contacted').length;
    const enrolledCount = inquiries.filter(i => i.status === 'Enrolled').length;

    res.json({
      success: true,
      stats: {
        totalLeads,
        enrollmentsCount,
        registrationsCount,
        contactsCount,
        pendingCount,
        contactedCount,
        enrolledCount,
      },
      inquiries
    });
  } catch (err) {
    console.error('Error fetching admin dashboard metrics:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve admin dashboard metrics.'
    });
  }
});

// GET /api/inquiries - Fetch all inquiries for admin portal
app.get('/api/inquiries', requireAdminAuth, async (req, res) => {
  try {
    const inquiries = await getAllInquiriesFromDb();
    res.json({
      success: true,
      count: inquiries.length,
      inquiries
    });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve stored inquiries.'
    });
  }
});

// PATCH /api/inquiries/:id/status - Update lead status
app.patch('/api/inquiries/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['New', 'Contacted', 'Enrolled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be New, Contacted, or Enrolled.'
      });
    }

    const updated = await updateInquiryStatusInDb(id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Inquiry with ID ${id} not found.`
      });
    }

    res.json({
      success: true,
      inquiry: updated
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update lead status.'
    });
  }
});

// DELETE /api/inquiries/:id - Delete lead entry
app.delete('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteInquiryFromDb(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Inquiry with ID ${id} not found.`
      });
    }

    res.json({
      success: true,
      message: `Inquiry ${id} deleted successfully.`
    });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete inquiry.'
    });
  }
});

// =========================================================================

// =========================================================================
// COLOR PALETTE API (PUBLIC READ, ADMIN WRITE & RESET)
// =========================================================================

// 1. GET /api/palette - Public read endpoint to retrieve active palette
app.get('/api/palette', async (req, res) => {
  try {
    const palette = await getPaletteFromDb();
    res.json({
      success: true,
      palette
    });
  } catch (err) {
    console.error('Error fetching color palette:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to load color palette from database.'
    });
  }
});

// 2. POST /api/palette - Admin-only endpoint to save/update palette with hex validation
app.post('/api/palette', requireAdminAuth, async (req, res) => {
  try {
    const inputPalette = req.body.palette || req.body;

    if (!inputPalette || typeof inputPalette !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload: Palette object is required.'
      });
    }

    // Validate that every color provided has a valid hex code
    for (const [key, value] of Object.entries(inputPalette)) {
      if (typeof value === 'string' && !isValidHexColor(value)) {
        return res.status(400).json({
          success: false,
          error: `Invalid hex color code for "${key}": "${value}". Hex colors must be valid CSS hex codes like #D31218 or #FFF.`
        });
      }
    }

    const saved = await savePaletteToDb(inputPalette);
    res.json({
      success: true,
      message: 'Color palette successfully updated across the website.',
      palette: saved
    });
  } catch (err) {
    console.error('Error saving color palette:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to save color palette.'
    });
  }
});

// 3. POST /api/palette/reset - Admin-only endpoint to reset palette to defaults
app.post('/api/palette/reset', requireAdminAuth, async (req, res) => {
  try {
    const defaultPalette = await resetPaletteInDb();
    res.json({
      success: true,
      message: 'Color palette successfully reset to default system colors.',
      palette: defaultPalette
    });
  } catch (err) {
    console.error('Error resetting color palette:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to reset color palette.'
    });
  }
});

// STATIC BUILD SERVING & SPA ROUTING
// =========================================================================

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🛡️  D'code IAS Backend API running on port ${PORT} [SECURED]`);
  console.log(`📧 Configured Owner Email: ${process.env.OWNER_EMAIL || 'info@decodeias.com'}`);
  console.log(`==================================================\n`);
});

export default app;
