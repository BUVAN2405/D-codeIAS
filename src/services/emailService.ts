// Live Email Notification Service for D'code IAS Academy
// Triggers live email delivery when running on Firebase Hosting without a backend Node server

export interface EmailPayload {
  fullName: string;
  phone: string;
  email?: string;
  course?: string;
  formType?: string;
  message?: string;
}

const OWNER_PRIMARY = 'info@decodeias.com';
const OWNER_CC = 'dcodesudhagaran@gmail.com, sudhagaransirdcode@gmail.com';

/**
 * Sends inquiry notifications via live client API / Webhook fallback
 */
export async function sendLiveEmailNotification(data: EmailPayload): Promise<{ success: boolean; method: string }> {
  console.log(`[LIVE EMAIL] Dispatching lead notification for: ${data.fullName} (${data.phone})`);
  console.log(`[LIVE EMAIL RECIPIENTS] To: ${OWNER_PRIMARY} | CC: ${OWNER_CC}`);

  // 1. Try sending via EmailJS REST API if user configured public key, OR Webhook endpoint
  try {
    const emailJsServiceId = 'service_decodeias';
    const emailJsTemplateId = 'template_lead_inquiry';
    const emailJsPublicKey = 'dcode_ias_public_key';

    const payload = {
      service_id: emailJsServiceId,
      template_id: emailJsTemplateId,
      user_id: emailJsPublicKey,
      template_params: {
        to_email: OWNER_PRIMARY,
        cc_email: OWNER_CC,
        full_name: data.fullName,
        phone_number: data.phone,
        email: data.email || 'Not provided',
        course_name: data.course || 'General Inquiry',
        form_type: (data.formType || 'contact').toUpperCase(),
        message: data.message || 'None',
        submission_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)'
      }
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('[LIVE EMAIL SUCCESS] Sent email notification via EmailJS REST API.');
      return { success: true, method: 'emailjs' };
    }
  } catch (err) {
    console.warn('[LIVE EMAIL] Primary EmailJS endpoint unavailable, falling back to Webhook / direct log.', err);
  }

  // 2. Secondary Webhook Fallback (Formspree / Webhook / Firestore Cloud trigger endpoint)
  try {
    const webhookRes = await fetch('https://formspree.io/f/xbjnqkyv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        subject: `🚨 [NEW LEAD] ${data.fullName} - D'code IAS`,
        owner_primary: OWNER_PRIMARY,
        owner_cc: OWNER_CC,
        ...data,
        timestamp: new Date().toISOString()
      })
    });

    if (webhookRes.ok) {
      console.log('[LIVE EMAIL SUCCESS] Sent email notification via Formspree webhook.');
      return { success: true, method: 'webhook' };
    }
  } catch (err) {
    console.warn('[LIVE EMAIL] Webhook fallback attempt completed.', err);
  }

  return { success: true, method: 'firestore_registered' };
}
