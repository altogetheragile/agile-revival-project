
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

    // Detect if this is a password reset request
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
      let email = body.email || (body.user && body.user.email);
      
      // Fallback for direct API calls
      if (!email && body.recipient) {
        email = body.recipient;
      }
      
      // Extract action link - prioritize the official Supabase action_link
      let actionLink = '';
      if (body.action_link) {
        // This is the key change - prioritize Supabase's action_link which contains the token
        actionLink = body.action_link;
        console.log('Using Supabase-provided action_link for reset');
      } else if (body.link) {
        actionLink = body.link;
      } else if (body.resetLink) {
        actionLink = body.resetLink;
      }
      
      // Create a fallback action link if none was provided
      if (!actionLink && email) {
        const baseUrl = Deno.env.get('PUBLIC_URL') || 'https://altogetheragile.com';
        actionLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}`;
        console.log('Generated fallback action link (no token):', actionLink);
      }
      
      console.log('Action link for reset email:', actionLink || 'No action link provided');
      
      if (!email) {
        throw new Error('No recipient email found in request');
      }
      
      console.log(`Sending password reset email to ${email}`);
      
      // Generate email HTML content with a more reliable approach
      let html = '';
      try {
        // First try to render the React template with a reasonable timeout
        const renderTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email rendering timed out after 8 seconds')), 8000)
        );
        
        const renderPromise = renderAsync(
          ResetPasswordEmail({ 
            actionLink,
            email
          })
        );
        
        // Race between rendering and timeout
        html = await Promise.race([renderPromise, renderTimeoutPromise]);
        console.log('Successfully rendered React email template');
      } catch (renderError) {
        console.error('Failed to render React email template, using fallback template:', renderError);
        
        // Fallback to a simple HTML template that's guaranteed to work
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  padding: 20px;
                  max-width: 600px;
                  margin: 0 auto;
                }
                .container {
                  border: 1px solid #eaeaea;
                  border-radius: 8px;
                  padding: 40px 20px;
                  margin-top: 20px;
                }
                h1 { margin-top: 0; color: #333; }
                .button {
                  display: inline-block;
                  background-color: #2563eb;
                  color: white;
                  font-weight: bold;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .link-container {
                  margin: 20px 0;
                  padding: 10px;
                  background-color: #f5f5f5;
                  border-radius: 4px;
                  word-break: break-all;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 14px;
                  color: #666;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Reset Your Password</h1>
                <p>Hello,</p>
                <p>We received a request to reset the password for your account. Click the button below to reset your password:</p>
                
                <a href="${actionLink}" class="button">Reset Your Password</a>
                
                <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
                <div class="link-container">
                  <a href="${actionLink}">${actionLink}</a>
                </div>
                
                <p>This password reset link will expire in 24 hours.</p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                
                <div class="footer">
                  <p>If you have any questions, please contact our support team.</p>
                </div>
              </div>
            </body>
          </html>
        `;
      }
      
      // Send the email with a more reliable approach and longer timeout
      try {
        console.log('Sending email to:', email);
        
        // Set a longer timeout for the sending operation
        const sendTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email sending timed out after 15 seconds')), 15000)
        );
        
        const sendPromise = resend.emails.send({
          from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to: [email],
          subject: 'Reset Your Password - AltogetherAgile',
          html: html,
        });
        
        // Race between sending and timeout
        const result = await Promise.race([sendPromise, sendTimeoutPromise]);
        console.log('Email sent successfully:', result);
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Password reset email sent successfully',
          data: result
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (sendError: any) {
        console.error('Email sending error:', sendError);
        
        // Return a more detailed error for debugging
        return new Response(JSON.stringify({
          error: true,
          message: sendError.message || 'Failed to send email',
          details: {
            errorType: typeof sendError,
            errorString: String(sendError),
            email: email,
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        });
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
