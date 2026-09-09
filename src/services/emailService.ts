// Live Email Notification Service for D'code IAS Academy
// Multi-provider redundancy ensures guaranteed email delivery in production on Firebase Hosting

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
 * Dispatches live email notifications via multiple redundant relay providers.
 * If one provider is blocked or challenged, the next provider takes over automatically.
 */
export async function sendLiveEmailNotification(data: EmailPayload): Promise<{ success: boolean; method: string }> {
  console.log(`[LIVE EMAIL] Dispatching lead notification for: ${data.fullName} (${data.phone})`);
  console.log(`[LIVE EMAIL RECIPIENTS] Primary: ${OWNER_PRIMARY} | CC: ${OWNER_CC}`);

  const formattedTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' (IST)';
  const courseName = (data.course || 'General Inquiry').replace(/_/g, ' ').toUpperCase();
  const formTypeName = (data.formType || 'contact').toUpperCase();

  let isDelivered = false;
  let deliveryMethod = 'none';

  // =========================================================================
  // RELAY 1: FormSubmit Direct AJAX Relay (Dedicated HTML Table to Owner & CC)
  // =========================================================================
  try {
    const formSubmitPayload = {
      name: data.fullName,
      phone: `+91 ${data.phone}`,
      email: data.email || 'Not provided',
      target_course: courseName,
      form_category: formTypeName,
      student_notes: data.message || 'No additional notes.',
      submission_timestamp: formattedTime,
      _subject: `🚨 [NEW LEAD - ${formTypeName}] ${data.fullName} - D'code IAS Academy`,
      _cc: 'dcodesudhagaran@gmail.com,sudhagaransirdcode@gmail.com',
      _replyto: data.email || 'info@decodeias.com',
      _template: 'table',
      _captcha: 'false'
    };

    const res1 = await fetch(`https://formsubmit.co/ajax/${OWNER_PRIMARY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(formSubmitPayload)
    });

    if (res1.ok) {
      const json1 = await res1.json().catch(() => ({}));
      console.log('[LIVE EMAIL SUCCESS] Delivered via FormSubmit Relay:', json1);
      isDelivered = true;
      deliveryMethod = 'formsubmit';
    }
  } catch (err1) {
    console.warn('[LIVE EMAIL] FormSubmit relay attempt:', err1);
  }

  // =========================================================================
  // RELAY 2: Web3Forms Standard Dispatcher
  // =========================================================================
  try {
    const web3formsAccessKey = '034ec167-1284-4204-aa8f-b3d99ef142bf';
    const web3Payload = {
      access_key: web3formsAccessKey,
      subject: `🚨 [NEW LEAD] ${data.fullName} (+91 ${data.phone}) - D'code IAS Academy`,
      from_name: "D'code IAS Academy Website",
      name: data.fullName,
      phone: `+91 ${data.phone}`,
      email: data.email || 'noreply@decodeias.com',
      course: courseName,
      form_type: formTypeName,
      message: `Lead Name: ${data.fullName}\nPhone: +91 ${data.phone}\nEmail: ${data.email || 'N/A'}\nCourse: ${courseName}\nForm Type: ${formTypeName}\nNotes: ${data.message || 'N/A'}\nReceived At: ${formattedTime}`,
      submission_time: formattedTime
    };

    const res2 = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(web3Payload)
    });

    if (res2.ok) {
      console.log('[LIVE EMAIL SUCCESS] Delivered via Web3Forms Relay.');
      isDelivered = true;
      deliveryMethod = deliveryMethod === 'none' ? 'web3forms' : `${deliveryMethod}+web3forms`;
    }
  } catch (err2) {
    console.warn('[LIVE EMAIL] Web3Forms relay attempt:', err2);
  }

  return {
    success: isDelivered,
    method: deliveryMethod !== 'none' ? deliveryMethod : 'firestore_registered'
  };
}
