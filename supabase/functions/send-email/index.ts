
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import WelcomeEmail from './_templates/welcome-email.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Get the sender email from environment variable or default to the Resend testing email
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') || 'onboarding@resend.dev';
const SENDER_NAME = Deno.env.get('SENDER_NAME') || 'Your Company';

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
    const { firstName, email } = await req.json();
    
    // Start email rendering early with a short timeout
    const renderPromise = new Promise(async (resolve, reject) => {
      try {
        const startTime = Date.now();
        console.log(`Starting email render for ${email} at ${startTime}`);
        
        const html = await renderAsync(
          WelcomeEmail({ firstName, email })
        );
        
        console.log(`Email rendered in ${Date.now() - startTime}ms`);
        resolve(html);
      } catch (error) {
        console.error(`Email rendering failed: ${error.message}`);
        reject(error);
      }
    });
    
    // Using a shorter separate timeout for rendering
    const renderTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email rendering timed out')), 4000);
    });
    
    console.log(`Attempting to render email for ${email} using sender: ${SENDER_NAME} <${SENDER_EMAIL}>`);
    
    try {
      // Race between rendering and timeout
      const html = await Promise.race([renderPromise, renderTimeoutPromise]);
      
      console.log(`Successfully rendered email template for ${email}`);
      
      // Now that we have the HTML rendered, proceed with sending
      console.log(`Sending email to ${email} using sender: ${SENDER_NAME} <${SENDER_EMAIL}>`);
      
      // Set up a slightly longer timeout for the actual sending
      const sendTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email sending timed out, but it might still be processed')), 6000);
      });
      
      // Attempt to send email with a timeout
      try {
        const sendPromise = resend.emails.send({
          from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to: [email],
          subject: 'Welcome to Our Platform!',
          html: html,
        });
        
        // Race between sending and timeout
        const result = await Promise.race([sendPromise, sendTimeoutPromise]);
        
        console.log(`Email sent successfully to ${email}`);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (error) {
        // If it's a timeout error, we'll return a partial success
        if (error.message.includes('timed out')) {
          console.log(`Email sending timed out for ${email}, but might still be processed`);
          return new Response(JSON.stringify({ 
            status: 'processing',
            message: 'Email is being processed but took too long to confirm. Check your inbox in a few minutes.'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 202
          });
        }
        
        throw error;
      }
    } catch (renderError) {
      // If rendering times out, just send plain text
      console.log(`Using fallback plain text email for ${email} due to rendering timeout`);
      
      const result = await resend.emails.send({
        from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        to: [email],
        subject: 'Welcome to Our Platform!',
        text: `Hello ${firstName || 'there'},\n\nWe're delighted to have you join us. If you requested a password reset, please check your inbox for instructions.\n\nBest regards,\n${SENDER_NAME}`,
      });
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      hint: 'The request failed but your password reset might still be processing. Check your email in a few minutes.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
