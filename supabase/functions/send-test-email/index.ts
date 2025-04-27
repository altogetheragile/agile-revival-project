
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
    const { recipient } = await req.json();
    
    if (!recipient) {
      throw new Error('Recipient email is required');
    }

    // Get SMTP credentials - no default fallbacks
    const smtpHostname = Deno.env.get('SMTP_HOST');
    const smtpPortStr = Deno.env.get('SMTP_PORT');
    const smtpUsername = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASS');
    const senderEmail = Deno.env.get('SENDER_EMAIL');
    const senderName = Deno.env.get('SENDER_NAME');

    // Validate all required SMTP settings are present
    if (!smtpHostname) throw new Error('SMTP_HOST is not configured');
    if (!smtpPortStr) throw new Error('SMTP_PORT is not configured');
    if (!smtpUsername) throw new Error('SMTP_USER is not configured');
    if (!smtpPassword) throw new Error('SMTP_PASS is not configured');
    if (!senderEmail) throw new Error('SENDER_EMAIL is not configured');
    if (!senderName) throw new Error('SENDER_NAME is not configured');

    const smtpPort = parseInt(smtpPortStr);
    if (isNaN(smtpPort)) {
      throw new Error('SMTP_PORT must be a valid number');
    }

    console.log(`Initializing SMTP connection to ${smtpHostname}:${smtpPort}`);
    console.log(`Sending test email to ${recipient} from ${senderEmail}`);

    const client = new SmtpClient();
    
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
      throw new Error(`Failed to connect to SMTP server: ${connError.message}`);
    }

    console.log('Sending email...');
    const result = await client.send({
      from: `${senderName} <${senderEmail}>`,
      to: recipient,
      subject: "Test Email from AltogetherAgile",
      content: `
        <h1>Test Email</h1>
        <p>This is a test email from your AltogetherAgile website.</p>
        <p>If you're receiving this, your email configuration is working correctly!</p>
        <hr>
        <p><strong>Email Details:</strong></p>
        <ul>
          <li>Sender: ${senderName}</li>
          <li>Recipient: ${recipient}</li>
          <li>Sent at: ${new Date().toISOString()}</li>
        </ul>
      `,
      html: true,
    });

    await client.close();
    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test email sent successfully",
        details: {
          recipient,
          timestamp: new Date().toISOString(),
          smtp_server: smtpHostname
        }
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    // Determine if it's a configuration error or a sending error
    const isConfigError = error.message.includes('not configured');
    
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message,
          type: isConfigError ? 'configuration' : 'sending',
          hint: isConfigError 
            ? 'Check your SMTP configuration in Supabase settings and ensure all required environment variables are set.'
            : 'There was an error sending the email. Check the Edge Function logs for more details.'
        }
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isConfigError ? 400 : 500
      }
    );
  }
});
