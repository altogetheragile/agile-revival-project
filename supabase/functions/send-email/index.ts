import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import WelcomeEmail from './_templates/welcome-email.tsx';
import ResetPasswordEmail from './_templates/reset-password-email.tsx';

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

    // Detect if this is a password reset request (either from our custom form or from Supabase)
    const isPasswordReset = 
      req.url.includes('reset-password') || 
      body.type === 'reset_password' ||
      (body.template && body.template === 'reset_password');
    
    // Log details to help debug
    console.log('Request URL:', req.url);
    console.log('Is password reset:', isPasswordReset);
    
    // For a password reset email
    if (isPasswordReset) {
      console.log('Sending password reset email');
      
      // Extract user email - try different possible locations
      // For Supabase auth webhook format
      let email = body.email || (body.user && body.user.email);
      
      // Fallback for direct API calls
      if (!email && body.recipient) {
        email = body.recipient;
      }
      
      // Extract action link - if from Supabase
      let actionLink = '';
      if (body.action_link) {
        actionLink = body.action_link;
      } else if (body.link) {
        actionLink = body.link;
      }
      
      if (!email) {
        throw new Error('No recipient email found in request');
      }
      
      console.log(`Sending password reset email to ${email}`);
      
      let html = '';
      try {
        // Try to render the template, with a 4s timeout
        const renderPromise = renderAsync(
          ResetPasswordEmail({ 
            actionLink,
            email
          })
        );
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Email rendering timed out')), 4000);
        });
        
        html = await Promise.race([renderPromise, timeoutPromise]);
      } catch (renderError) {
        console.error('Failed to render email template:', renderError);
        // Fallback to plain text
        html = `
          <html>
            <body>
              <h1>Password Reset Request</h1>
              <p>You requested a password reset for your account. Click the link below to reset your password:</p>
              <p><a href="${actionLink}">Reset your password</a></p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </body>
          </html>
        `;
      }
      
      // Send the email with a slightly longer timeout
      try {
        const sendTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Email sending timed out')), 8000);
        });
        
        const sendPromise = resend.emails.send({
          from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to: [email],
          subject: 'Reset Your Password',
          html: html,
        });
        
        const result = await Promise.race([sendPromise, sendTimeoutPromise]);
        console.log('Email sent successfully:', result);
        
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (sendError) {
        console.error('Email sending error:', sendError);
        throw sendError;
      }
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
  } catch (error) {
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
