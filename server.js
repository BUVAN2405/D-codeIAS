import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  saveInquiryToDb,
  getAllInquiriesFromDb,
  updateInquiryStatusInDb,
  deleteInquiryFromDb
} from './server/db.js';
import { sendInquiryNotification } from './server/mailer.js';

dotenv.config();

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
    timestamp: new Date().toISOString()
  });
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

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 D'code IAS Backend API running on port ${PORT}`);
  console.log(`📧 Configured Owner Email: ${process.env.OWNER_EMAIL || 'bhuvaneshwaan2405@gmail.com'}`);
  console.log(`==================================================\n`);
});
