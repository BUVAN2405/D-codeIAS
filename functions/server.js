import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  saveInquiryToDb,
  getAllInquiriesFromDb,
  updateInquiryStatusInDb,
  deleteInquiryFromDb
} from './server/db.js';
import { sendInquiryNotification } from './server/mailer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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


// POST /api/admin/login - Authenticate owner for admin dashboard
app.post('/api/admin/login', (req, res) => {
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
    return res.json({
      success: true,
      token: `dcode_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      admin: {
        email: targetEmail,
        role: 'Administrator',
        loginTime: new Date().toISOString()
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid admin email or password. Please check your credentials.'
    });
  }
});

// GET /api/admin/dashboard - Fetch database statistics & aggregated lead metrics
app.get('/api/admin/dashboard', async (req, res) => {
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

// POST /api/inquiries - Create new lead submission & send email
app.post('/api/inquiries', async (req, res) => {
  try {
    const { fullName, phone, email, course, formType, message } = req.body;

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
      formType: formType || 'contact',
      message
    });

    // 2. Dispatch email to website owner & confirmation to student
    const emailStatus = await sendInquiryNotification(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Inquiry received and email dispatched to website owner.',
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

// GET /api/inquiries - Fetch all inquiries for admin portal
app.get('/api/inquiries', async (req, res) => {
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
app.patch('/api/inquiries/:id/status', async (req, res) => {
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
app.delete('/api/inquiries/:id', async (req, res) => {
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

// Serve frontend static build files (production mode)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for Single Page Application routing (non-API routes)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 D'code IAS Backend API running on port ${PORT}`);
  console.log(`📧 Configured Owner Email: ${process.env.OWNER_EMAIL || 'bhuvaneshwaan2405@gmail.com'}`);
  console.log(`==================================================\n`);
});

export default app;

