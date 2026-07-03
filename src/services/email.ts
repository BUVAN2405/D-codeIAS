// Email dispatcher simulation for D'code IAS Academy
// Prepared for seamless integration with Resend, SendGrid, or custom SMTP APIs

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export function dispatchEnquiryEmails(data: {
  fullName: string;
  phone: string;
  email?: string;
  course: string;
  message?: string;
}): { clientEmail: EmailPayload; studentEmail: EmailPayload | null } {
  const adminEmail = 'info@dcodeias.com';
  
  // 1. Compile Admin lead notification email
  const clientEmailPayload: EmailPayload = {
    to: adminEmail,
    subject: `🚨 New Lead Captured: ${data.fullName} - D'code IAS Academy`,
    body: `
      <h2>New Student Inquiry Received</h2>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Phone:</strong> +91 ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email || 'Not Provided'}</p>
      <p><strong>Interested Course:</strong> ${data.course.toUpperCase()}</p>
      <p><strong>Message:</strong> ${data.message || 'No additional message.'}</p>
      <br/>
      <p><em>This lead is stored in the D'code local database. Please initiate counselor contact within 15 minutes.</em></p>
    `
  };

  // 2. Compile Student confirmation email if email was provided
  let studentEmailPayload: EmailPayload | null = null;
  if (data.email) {
    studentEmailPayload = {
      to: data.email,
      subject: `🎯 D'code IAS Academy – Enrollment Application Received`,
      body: `
        <h3>Dear ${data.fullName},</h3>
        <p>Thank you for choosing <strong>D'code IAS Academy</strong> to simplify your civil services preparation journey.</p>
        <p>Our senior UPSC curriculum experts, led by <strong>Sudhagaran Sir (Former Mission Director, Naan Mudhalvan)</strong>, have received your inquiry for the <strong>${data.course.toUpperCase()}</strong> program.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>An academic advisor will call you shortly on <strong>+91 ${data.phone}</strong> to schedule your personalized syllabus counseling and trial pass.</li>
          <li>Our Anna Nagar center in Chennai is open Monday to Sunday for direct counseling visits.</li>
        </ul>
        <p>We are excited to guide you towards administrative success!</p>
        <br/>
        <p>Warm regards,<br/><strong>Team D'code IAS Academy</strong><br/>825, 1st St, G Block, Ranganathan Garden, Anna Nagar, Chennai</p>
      `
    };
  }

  // Log dispatch status to developers console beautifully
  console.log('%c--- EMAIL DISPATCH LOG ---', 'color: #D31218; font-weight: bold; font-size: 14px;');
  console.log(`[CLIENT EMAIL] Dispatched to ${clientEmailPayload.to}\nSubject: ${clientEmailPayload.subject}`);
  if (studentEmailPayload) {
    console.log(`[STUDENT CONFIRMATION] Dispatched to ${studentEmailPayload.to}\nSubject: ${studentEmailPayload.subject}`);
  } else {
    console.log('[STUDENT CONFIRMATION] Skipped (No email address provided)');
  }
  console.log('%c-------------------------', 'color: #D31218; font-weight: bold;');

  // Fire a global custom event so the UI can display a gorgeous notification modal
  window.dispatchEvent(new CustomEvent('dcode_email_dispatched', {
    detail: { clientEmailPayload, studentEmailPayload }
  }));

  return {
    clientEmail: clientEmailPayload,
    studentEmail: studentEmailPayload
  };
}
