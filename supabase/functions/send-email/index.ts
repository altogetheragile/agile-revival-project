
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
      console.log('Failed to parse JSON body:', error.message);
      body = {};
    }

    // Log additional diagnostic information
    console.log('Request URL:', req.url);
    console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Get SMTP credentials from environment variables
    // These should match the Mailgun settings configured in Supabase
    const smtpHostname = Deno.env.get('SMTP_HOST') || 'smtp.mailgun.org';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUsername = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASS');
    const senderEmail = Deno.env.get('SENDER_EMAIL') || 'no-reply@altogetheragile.com';
    const senderName = Deno.env.get('SENDER_NAME') || 'AltogetherAgile';
    
    if (!smtpUsername || !smtpPassword) {
      throw new Error("SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.");
    }
    
    console.log(`SMTP Config: ${smtpHostname}:${smtpPort}`);
    
    // Check if this is a test email request
    if (body.type === 'test') {
      console.log('Sending test email');
      
      // Determine the recipient - either specified or fallback
      const recipient = body.recipient || senderEmail;
      console.log(`Sending test email to ${recipient} from ${senderEmail}`);
      
      // Create SMTP client
      const client = new SmtpClient();
      
      // Connect to SMTP server
      await client.connectTLS({
        hostname: smtpHostname,
        port: smtpPort,
        username: smtpUsername,
        password: smtpPassword,
      });
      
      // Send the email
      const result = await client.send({
        from: `${senderName} <${senderEmail}>`,
        to: recipient,
        subject: "Test Email from AltogetherAgile",
        content: `
          <h1>Test Email</h1>
          <p>This is a test email from your AltogetherAgile website.</p>
          <p>If you're receiving this, your email configuration is working correctly!</p>
          <hr />
          <h2>Email Configuration Details:</h2>
          <ul>
            <li><strong>Sender Email:</strong> ${senderEmail}</li>
            <li><strong>Sender Name:</strong> ${senderName}</li>
            <li><strong>Recipient:</strong> ${recipient}</li>
            <li><strong>Sent at:</strong> ${new Date().toISOString()}</li>
          </ul>
        `,
        html: true,
      });
      
      // Close the connection
      await client.close();
      
      console.log('Test email result:', result);
      
      return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    } 
    
    // Handle custom emails (e.g. welcome emails, notifications)
    else if (body.type === 'custom') {
      const { recipient, subject, htmlContent, textContent } = body;
      
      if (!recipient) {
        throw new Error('No recipient email specified');
      }
      
      // Create SMTP client
      const client = new SmtpClient();
      
      // Connect to SMTP server
      await client.connectTLS({
        hostname: smtpHostname,
        port: smtpPort,
        username: smtpUsername,
        password: smtpPassword,
      });
      
      // Send the email
      const result = await client.send({
        from: `${senderName} <${senderEmail}>`,
        to: recipient,
        subject: subject || "Message from AltogetherAgile",
        content: htmlContent || textContent || "This is a message from AltogetherAgile.",
        html: !!htmlContent,
      });
      
      // Close the connection
      await client.close();
      
      console.log('Custom email result:', result);
      
      return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // Default response for unhandled cases
    return new Response(JSON.stringify({ 
      error: {
        message: "Invalid request type. Please specify 'test' or 'custom' type."
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    });
    
  } catch (error: any) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        hint: 'Check your SMTP configuration and ensure all required environment variables are set.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
