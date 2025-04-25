
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import ResetPasswordEmail from './_templates/reset-password-email.tsx';
import WelcomeEmail from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Get the sender email from environment variable or default to the Resend testing email
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev';
const SENDER_NAME = Deno.env.get('SENDER_NAME') || 'AltogetherAgile';

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
    // First try to extract JSON body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body));
    } catch (error) {
      console.log('Failed to parse JSON body:', error.message);
      body = {};
    }

    // Log additional diagnostic information
    console.log('Request URL:', req.url);
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    console.log('Using sender email:', SENDER_EMAIL);
    console.log('Using sender name:', SENDER_NAME);
    
    // Check if this is a test email request
    if (body.type === 'test') {
      console.log('Sending test email');
      
      // Determine the recipient - either specified or fallback to sender
      const recipient = body.recipient || SENDER_EMAIL;
      console.log(`Sending test email to ${recipient} from ${SENDER_EMAIL}`);
      
      // Include more detailed information in the test email
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
      
      return new Response(JSON.stringify(testResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Detect if this is a password reset request
    const isPasswordReset = 
      req.url.includes('reset-password') || 
      body.type === 'reset_password' ||
      (body.template && body.template === 'reset_password');
    
    // Log details to help debug
    console.log('Is password reset:', isPasswordReset);
    
    // For a password reset email
    if (isPasswordReset) {
      console.log('Sending password reset email');
      
      // Extract email from different possible locations in the request
      let email = body.email || (body.user && body.user.email) || body.recipient;
      
      if (!email) {
        throw new Error('No recipient email found in password reset request');
      }
      
      console.log(`Recipient email for reset: ${email}`);
      
      // Generate a reset token if one wasn't provided
      const resetToken = body.token || crypto.randomUUID();
      
      // Construct the direct reset URL using the origin and token
      const origin = req.headers.get('origin') || Deno.env.get('PUBLIC_URL') || 'https://altogetheragile.com';
      
      // Get the hash fragment from the request (if any)
      const hash = body.hash || '';
      
      // Generate the reset link - we'll now include a hash parameter and token for Auth API compatibility
      const resetLink = `${origin}/reset-password?token=${resetToken}&type=recovery&email=${encodeURIComponent(email)}${hash ? `#${hash}` : ''}`;
      
      console.log('Generated reset link:', resetLink);
      
      // Generate email HTML content
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
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Password reset email sent successfully',
        data: result
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } else {
      // For a welcome email or other generic emails
      const { firstName, email } = body;
    
      if (!email) {
        throw new Error('No recipient email found in request');
      }
      
      console.log(`Sending welcome email to ${email}`);
      
      // Try to render the welcome template
      let html = '';
      try {
        const renderPromise = renderAsync(
          WelcomeEmail({ firstName: firstName || 'there', email })
        );
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Email rendering timed out')), 4000);
        });
        
        html = await Promise.race([renderPromise, timeoutPromise]);
      } catch (renderError) {
        console.error('Failed to render welcome email template:', renderError);
        // Fallback to plain text
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
        subject: 'Welcome to Our Platform!',
        html: html,
      });
      
      console.log('Email sent successfully:', result);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
  } catch (error: any) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        hint: 'The request failed but your password reset might still be processing. Check your email in a few minutes.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
