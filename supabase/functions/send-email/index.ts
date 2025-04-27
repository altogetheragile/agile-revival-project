
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import ResetPasswordEmail from './_templates/reset-password-email.tsx';
import WelcomeEmail from './_templates/welcome-email.tsx';

// Initialize Resend with API key
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Get the sender email from environment variable or default to the Resend testing email
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev';
const SENDER_NAME = Deno.env.get('SENDER_NAME') || 'AltogetherAgile';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse JSON body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body));
    } catch (error) {
      console.log('Failed to parse JSON body:', error.message);
      body = {};
    }

    // Log diagnostic information
    console.log('Request URL:', req.url);
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    console.log('Using sender email:', SENDER_EMAIL);
    console.log('Using sender name:', SENDER_NAME);
    
    // Determine email type and handle accordingly
    const emailType = determineEmailType(req.url, body);
    console.log('Determined email type:', emailType);
    
    let result;
    
    switch(emailType) {
      case 'test':
        result = await sendTestEmail(body);
        break;
      case 'reset_password':
        result = await sendPasswordResetEmail(body);
        break;
      case 'welcome':
        result = await sendWelcomeEmail(body);
        break;
      default:
        result = await sendGenericEmail(body);
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
    
  } catch (error: any) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        hint: 'The request failed but your email might still be processing. Please try again in a few minutes.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});

// Helper function to determine email type based on request URL and body
function determineEmailType(url: string, body: any): string {
  if (body.type) {
    return body.type;
  }
  
  if (body.template) {
    return body.template;
  }
  
  if (url.includes('reset-password') || (body.user && body.token)) {
    return 'reset_password';
  }
  
  if (body.firstName && body.email && !body.token) {
    return 'welcome';
  }
  
  return 'generic';
}

// Send test email
async function sendTestEmail(body: any) {
  console.log('Sending test email');
  
  // Determine the recipient - either specified or fallback to sender
  const recipient = body.recipient || SENDER_EMAIL;
  console.log(`Sending test email to ${recipient} from ${SENDER_EMAIL}`);
  
  // Include detailed information in test email
  const testResult = await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: [recipient],
    subject: 'Test Email from AltogetherAgile',
    html: `
      <h1>Test Email</h1>
      <p>This is a test email from your AltogetherAgile website.</p>
      <p>If you're receiving this, your email configuration is working correctly!</p>
      <hr />
      <h2>Email Configuration Details:</h2>
      <ul>
        <li><strong>Sender Email:</strong> ${SENDER_EMAIL}</li>
        <li><strong>Sender Name:</strong> ${SENDER_NAME}</li>
        <li><strong>Recipient:</strong> ${recipient}</li>
        <li><strong>Sent at:</strong> ${new Date().toISOString()}</li>
      </ul>
      <p>If you're experiencing delivery issues:</p>
      <ol>
        <li>Verify your domain at <a href="https://resend.com/domains">Resend Domains</a></li>
        <li>Make sure your SENDER_EMAIL secret matches your verified domain</li>
        <li>Check if you've exceeded your free tier limits</li>
      </ol>
    `,
  });
  
  console.log('Test email result:', testResult);
  return testResult;
}

// Send password reset email
async function sendPasswordResetEmail(body: any) {
  console.log('Sending password reset email');
  
  // Extract email from different possible locations
  let email = body.email || (body.user && body.user.email) || body.recipient;
  
  if (!email) {
    throw new Error('No recipient email found in password reset request');
  }
  
  console.log(`Recipient email for reset: ${email}`);
  
  // Generate a reset token if not provided
  const resetToken = body.token || crypto.randomUUID();
  
  // Construct the reset URL
  const origin = body.origin || Deno.env.get('PUBLIC_URL') || 'https://altogetheragile.com';
  
  // Get hash fragment from request (if any)
  const hash = body.hash || '';
  
  // Generate the reset link with token and hash
  const resetLink = `${origin}/reset-password?token=${resetToken}&type=recovery&email=${encodeURIComponent(email)}${hash ? `#${hash}` : ''}`;
  
  console.log('Generated reset link:', resetLink);
  
  // Generate email HTML using React Email template
  let html = '';
  try {
    html = await renderAsync(
      ResetPasswordEmail({ 
        actionLink: resetLink,
        email
      })
    );
    console.log('Successfully rendered React email template');
  } catch (renderError) {
    console.error('Failed to render React email template:', renderError);
    throw renderError;
  }
  
  // Send the email with Resend
  const result = await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: [email],
    subject: 'Reset Your Password - AltogetherAgile',
    html: html,
  });
  
  console.log('Password reset email sent result:', result);
  
  return {
    success: true,
    message: 'Password reset email sent successfully',
    data: result
  };
}

// Send welcome email
async function sendWelcomeEmail(body: any) {
  const { firstName, email } = body;

  if (!email) {
    throw new Error('No recipient email found in request');
  }
  
  console.log(`Sending welcome email to ${email}`);
  
  // Render welcome template
  let html = '';
  try {
    html = await renderAsync(
      WelcomeEmail({ firstName: firstName || 'there', email })
    );
  } catch (renderError) {
    console.error('Failed to render welcome email template:', renderError);
    // Fallback to plain HTML
    html = `
      <html>
        <body>
          <h1>Welcome!</h1>
          <p>Hello ${firstName || 'there'},</p>
          <p>Thank you for joining our platform. We're excited to have you with us!</p>
        </body>
      </html>
    `;
  }
  
  // Send the email
  const result = await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: [email],
    subject: 'Welcome to AltogetherAgile!',
    html: html,
  });
  
  console.log('Welcome email sent successfully:', result);
  return result;
}

// Send generic email
async function sendGenericEmail(body: any) {
  const { subject, recipient, content, template } = body;
  
  if (!recipient) {
    throw new Error('No recipient specified');
  }
  
  console.log(`Sending generic email to ${recipient}`);
  
  // Send basic email
  const result = await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: [recipient],
    subject: subject || 'Message from AltogetherAgile',
    html: content || `<p>This is an automated message from AltogetherAgile.</p>`,
  });
  
  console.log('Generic email sent successfully:', result);
  return result;
}
