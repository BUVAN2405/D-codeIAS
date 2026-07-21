import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'info@decodeias.com';
const OWNER_CC_EMAIL = process.env.OWNER_CC_EMAIL || 'dcodesudhagaran@gmail.com';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
  console.log(`[MAILER] Configured SMTP Transporter for host ${SMTP_HOST} (Owner: ${OWNER_EMAIL})`);
} else {
  console.log(`[MAILER] SMTP credentials not fully provided in .env. Operating in logging mode for owner email: ${OWNER_EMAIL}`);
}

export async function sendInquiryNotification(record) {
  const formTitleMap = {
    registration: 'Registration Form',
    enrollment: 'Enrollment Form',
    contact: 'Contact / Inquiry Form',
    inquiry: 'General Inquiry'
  };

  const formTitle = formTitleMap[record.formType] || 'Inquiry Form';
  const subject = `🚨 [${formTitle.toUpperCase()}] New Submission: ${record.fullName} - D'code IAS Academy`;

  // Set custom color codes based on formType
  let badgeBg = '#f1f5f9';
  let badgeText = '#475569';
  let badgeBorder = '#cbd5e1';
  
  if (record.formType === 'enrollment') {
    badgeBg = '#eff6ff';
    badgeText = '#1d4ed8';
    badgeBorder = '#bfdbfe';
  } else if (record.formType === 'registration') {
    badgeBg = '#faf5ff';
    badgeText = '#6d28d9';
    badgeBorder = '#e9d5ff';
  } else if (record.formType === 'contact' || record.formType === 'inquiry') {
    badgeBg = '#fffbeb';
    badgeText = '#b45309';
    badgeBorder = '#fde68a';
  }

  const destinationUrl = process.env.DATABASE_DASHBOARD_URL || `${process.env.APP_URL || 'http://localhost:3000'}?leads=true`;

  const ownerHtml = `
    <div style="background-color: #f1f5f9; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03); overflow: hidden;">
        <!-- Top Colored Accent Line -->
        <div style="height: 4px; background-color: #D31218;"></div>
        
        <!-- Header Section -->
        <div style="padding: 32px 32px 20px 32px; border-b: 1px solid #f1f5f9;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td>
                <span style="font-family: 'Georgia', serif; font-size: 20px; font-weight: bold; color: #0D2C54; letter-spacing: -0.5px;">D'code IAS Academy</span>
              </td>
              <td style="text-align: right;">
                <span style="background-color: ${badgeBg}; color: ${badgeText}; border: 1px solid ${badgeBorder}; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${formTitle}
                </span>
              </td>
            </tr>
          </table>
          <h1 style="font-size: 24px; color: #0f172a; margin: 24px 0 8px 0; font-weight: 800; letter-spacing: -0.5px;">New Student Submission</h1>
          <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">A new lead has been captured on your website portal. Please initiate contact within 15 minutes.</p>
        </div>

        <!-- Details Grid Section -->
        <div style="padding: 0 32px 24px 32px;">
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; border: 1px solid #f1f5f9;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 35%; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px;">Full Name</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700; font-size: 14px;">${record.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px;">Phone Number</td>
                <td style="padding: 6px 0; font-weight: 700;"><a href="tel:${record.phone}" style="color: #D31218; text-decoration: none;">+91 ${record.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px;">Email Address</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 500;">${record.email ? `<a href="mailto:${record.email}" style="color: #0d2c54; text-decoration: none; border-bottom: 1px solid #cbd5e1;">${record.email}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px;">Target Program</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-size: 12px; color: #0d2c54;">${record.course ? record.course.replace(/_/g, ' ') : 'General Inquiry'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px;">Received At</td>
                <td style="padding: 6px 0; color: #334155; font-weight: 500;">${new Date(record.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Student Notes / Details -->
        ${record.message ? `
          <div style="padding: 0 32px 32px 32px;">
            <div style="border-left: 3px solid #cbd5e1; padding-left: 16px;">
              <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Student Notes / Form Data</span>
              <blockquote style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; font-style: italic;">
                "${record.message}"
              </blockquote>
            </div>
          </div>
        ` : ''}

        <!-- Call to Action Link -->
        <div style="padding: 0 32px 32px 32px; text-align: center;">
          <a href="${destinationUrl}" style="display: inline-block; background-color: #0D2C54; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 2px 4px rgba(13, 44, 84, 0.15);">
            Open Leads Database
          </a>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
            Reference ID: ${record.id} • D'code IAS Admin
          </p>
        </div>
      </div>
    </div>
  `;

  let ownerMailSent = false;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"D'code Lead System" <${SMTP_USER || 'info@decodeias.com'}>`,
        to: OWNER_EMAIL,
        cc: OWNER_CC_EMAIL || undefined,
        subject: subject,
        html: ownerHtml
      });
      ownerMailSent = true;
      console.log(`[MAILER SUCCESS] Email sent to Owner (${OWNER_EMAIL}) & CC (${OWNER_CC_EMAIL}) for lead ${record.id}`);
    } catch (err) {
      console.error(`[MAILER ERROR] Failed to send email to Owner (${OWNER_EMAIL}):`, err);
    }
  } else {
    console.log(`\n================== [MAILER PREVIEW LOG] ==================`);
    console.log(`TO: ${OWNER_EMAIL} | CC: ${OWNER_CC_EMAIL}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`LEAD DETAILS: Name=${record.fullName}, Phone=${record.phone}, Email=${record.email || 'N/A'}, FormType=${record.formType}`);
    console.log(`===========================================================\n`);
    ownerMailSent = true; // Recorded log preview
  }

  // Also send student confirmation if applicant provided email and is not the owner/CC
  let studentMailSent = false;
  if (record.email && record.email !== OWNER_EMAIL && record.email !== OWNER_CC_EMAIL) {
    const studentHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #0D2C54; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">D'code IAS Academy</h2>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #cbd5e1;">Simplifying UPSC & TNPSC Civil Services Preparation</p>
        </div>

        <div style="padding: 24px; color: #1e293b;">
          <h3 style="margin-top: 0; color: #0D2C54;">Dear ${record.fullName},</h3>
          <p>Thank you for reaching out to <strong>D'code IAS Academy</strong>.</p>
          <p>We have received your application/inquiry for the <strong>${record.course ? record.course.toUpperCase() : 'Civil Services Program'}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <h4 style="margin: 0 0 8px 0; color: #D31218;">What happens next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #334155;">
              <li>Our academic advisors will contact you shortly on <strong>+91 ${record.phone}</strong>.</li>
              <li>You will receive syllabus guidance, batch schedules, and access to trial passes.</li>
            </ul>
          </div>

          <p>For urgent queries, feel free to visit our Anna Nagar center in Chennai or reach out via WhatsApp.</p>
          <br/>
          <p style="margin: 0; font-weight: bold; color: #0D2C54;">Warm regards,</p>
          <p style="margin: 4px 0 0 0; color: #475569;">Team D'code IAS Academy<br/>Anna Nagar, Chennai</p>
        </div>
      </div>
    `;

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"D'code IAS Academy" <${SMTP_USER || 'noreply@dcodeias.com'}>`,
          to: record.email,
          subject: `🎯 D'code IAS Academy - ${formTitle} Received`,
          html: studentHtml
        });
        studentMailSent = true;
        console.log(`[MAILER SUCCESS] Student confirmation email sent to ${record.email}`);
      } catch (err) {
        console.error(`[MAILER ERROR] Failed to send student confirmation to ${record.email}:`, err);
      }
    } else {
      console.log(`[MAILER LOG] Student confirmation preview logged for ${record.email}`);
      studentMailSent = true;
    }
  }

  return { ownerMailSent, studentMailSent };
}
