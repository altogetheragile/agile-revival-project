
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import ResetPasswordEmail from "./_templates/reset-password-email.tsx";
import { renderToString } from "npm:react-dom@18.3.1/server";
import React from "npm:react@18.3.1";

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
    // Extract JSON body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body));
    } catch (error) {
      console.error('Failed to parse JSON body:', error.message);
      throw new Error(`Invalid request format: ${error.message}`);
    }

    // Log additional diagnostic information
    console.log('Request URL:', req.url);
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Get SMTP credentials from environment variables
    const smtpHostname = Deno.env.get('SMTP_HOST');
    const smtpPortStr = Deno.env.get('SMTP_PORT');
    const smtpUsername = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASS');
    const senderEmail = Deno.env.get('SENDER_EMAIL');
    const senderName = Deno.env.get('SENDER_NAME');
    
    // Validate SMTP configuration
    if (!smtpHostname) {
      throw new Error("SMTP_HOST is not configured in environment variables");
    }
    
    if (!smtpPortStr) {
      throw new Error("SMTP_PORT is not configured in environment variables");
    }
    
    if (!smtpUsername) {
      throw new Error("SMTP_USER is not configured in environment variables");
    }
    
    if (!smtpPassword) {
      throw new Error("SMTP_PASS is not configured in environment variables");
    }
    
    if (!senderEmail) {
      throw new Error("SENDER_EMAIL is not configured in environment variables");
    }
    
    const smtpPort = parseInt(smtpPortStr);
    if (isNaN(smtpPort)) {
      throw new Error(`Invalid SMTP_PORT: ${smtpPortStr} - must be a number`);
    }
    
    console.log(`SMTP Config: ${smtpHostname}:${smtpPort} (${senderEmail})`);
    
    // Handle password reset request
    if (body.type === 'reset_password') {
      console.log('Processing password reset request');
      
      const email = body.email || body.recipient;
      if (!email) {
        throw new Error('No recipient email specified for password reset');
      }
      
      const resetLink = body.resetLink || `${Deno.env.get('PUBLIC_URL') || 'https://altogetheragile.com'}/reset-password?email=${encodeURIComponent(email)}`;
      console.log(`Reset link for ${email}: ${resetLink}`);
      
      // Create SMTP client
      const client = new SmtpClient();
      
      console.log('Attempting SMTP connection for password reset email...');
      try {
        // Connect to SMTP server
        await client.connectTLS({
          hostname: smtpHostname,
          port: smtpPort,
          username: smtpUsername,
          password: smtpPassword,
        });
        console.log('SMTP connection established successfully');
      } catch (connError) {
        console.error('SMTP connection failed:', connError);
        throw new Error(`Failed to connect to SMTP server (${smtpHostname}:${smtpPort}): ${connError.message}`);
      }
      
      try {
        // Render the email template
        const emailHtml = renderToString(
          React.createElement(ResetPasswordEmail, {
            actionLink: resetLink,
            email: email
          })
        );
        
        console.log('Sending password reset email...');
        // Send the email
        const result = await client.send({
          from: senderName ? `${senderName} <${senderEmail}>` : senderEmail,
          to: email,
          subject: "Reset Your AltogetherAgile Password",
          content: emailHtml,
          html: true,
        });
        
        console.log('Password reset email result:', result);
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Password reset email sent successfully",
          details: {
            recipient: email,
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (sendError) {
        console.error('Email sending error:', sendError);
        throw new Error(`Failed to send password reset email: ${sendError.message}`);
      } finally {
        try {
          // Always attempt to close the connection
          await client.close();
          console.log('SMTP connection closed');
        } catch (closeError) {
          console.error('Error closing SMTP connection:', closeError);
        }
      }
    }
    
    // Check if this is a test email request
    else if (body.type === 'test') {
      console.log('Sending test email');
      
      if (!body.recipient) {
        throw new Error('No recipient email specified for test email');
      }
      
      // Create SMTP client
      const client = new SmtpClient();
      
      // Connect to SMTP server
      console.log('Attempting SMTP connection...');
      try {
        await client.connectTLS({
          hostname: smtpHostname,
          port: smtpPort,
          username: smtpUsername,
          password: smtpPassword,
        });
        console.log('SMTP connection established successfully');
      } catch (connError) {
        console.error('SMTP connection failed:', connError);
        throw new Error(`Failed to connect to SMTP server (${smtpHostname}:${smtpPort}): ${connError.message}`);
      }
      
      try {
        // Send the email
        console.log(`Sending test email to ${body.recipient}...`);
        const result = await client.send({
          from: senderName ? `${senderName} <${senderEmail}>` : senderEmail,
          to: body.recipient,
          subject: "Test Email from AltogetherAgile",
          content: `
            <h1>Test Email</h1>
            <p>This is a test email from your AltogetherAgile website.</p>
            <p>If you're receiving this, your email configuration is working correctly!</p>
            <hr />
            <h2>Email Configuration Details:</h2>
            <ul>
              <li><strong>Sender Email:</strong> ${senderEmail}</li>
              <li><strong>Sender Name:</strong> ${senderName || 'Not specified'}</li>
              <li><strong>Recipient:</strong> ${body.recipient}</li>
              <li><strong>Sent at:</strong> ${new Date().toISOString()}</li>
            </ul>
          `,
          html: true,
        });
        
        console.log('Test email result:', result);
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Email sent successfully",
          details: {
            recipient: body.recipient,
            timestamp: new Date().toISOString(),
            smtp_server: smtpHostname
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (sendError) {
        console.error('Email sending error:', sendError);
        throw new Error(`Failed to send test email: ${sendError.message}`);
      } finally {
        try {
          // Always attempt to close the connection
          await client.close();
          console.log('SMTP connection closed');
        } catch (closeError) {
          console.error('Error closing SMTP connection:', closeError);
        }
      }
    } 
    
    // Handle custom emails (e.g. welcome emails, notifications)
    else if (body.type === 'custom') {
      const { recipient, subject, htmlContent, textContent } = body;
      
      if (!recipient) {
        throw new Error('No recipient email specified for custom email');
      }
      
      // Create SMTP client
      const client = new SmtpClient();
      
      // Connect to SMTP server
      console.log('Attempting SMTP connection for custom email...');
      try {
        await client.connectTLS({
          hostname: smtpHostname,
          port: smtpPort,
          username: smtpUsername,
          password: smtpPassword,
        });
        console.log('SMTP connection established successfully');
      } catch (connError) {
        console.error('SMTP connection failed:', connError);
        throw new Error(`Failed to connect to SMTP server (${smtpHostname}:${smtpPort}): ${connError.message}`);
      }
      
      try {
        // Send the email
        console.log(`Sending custom email to ${recipient}...`);
        const result = await client.send({
          from: senderName ? `${senderName} <${senderEmail}>` : senderEmail,
          to: recipient,
          subject: subject || "Message from AltogetherAgile",
          content: htmlContent || textContent || "This is a message from AltogetherAgile.",
          html: !!htmlContent,
        });
        
        console.log('Custom email result:', result);
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Email sent successfully",
          details: {
            recipient,
            timestamp: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      } catch (sendError) {
        console.error('Email sending error:', sendError);
        throw new Error(`Failed to send custom email: ${sendError.message}`);
      } finally {
        try {
          // Always attempt to close the connection
          await client.close();
          console.log('SMTP connection closed');
        } catch (closeError) {
          console.error('Error closing SMTP connection:', closeError);
        }
      }
    }
    
    // Default response for unhandled cases
    return new Response(JSON.stringify({ 
      error: {
        message: "Invalid request type. Please specify 'test', 'reset_password' or 'custom' type."
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
    
  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Determine if it's a configuration error
    const isConfigError = error.message?.includes('not configured') || 
                          error.message?.includes('credentials') ||
                          error.message?.includes('SMTP_');
    
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        type: isConfigError ? 'configuration' : 'sending',
        hint: isConfigError 
          ? 'Check your SMTP configuration in Supabase settings and ensure all required environment variables are set.'
          : 'There was an error sending the email. Check the Edge Function logs for more details.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: isConfigError ? 400 : 500
    });
  }
});
