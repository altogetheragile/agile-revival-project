
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

    // Get SMTP credentials from environment variables
    const smtpHostname = Deno.env.get('SMTP_HOST') || 'smtp.mailgun.org';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUsername = Deno.env.get('SMTP_USER');
    const smtpPassword = Deno.env.get('SMTP_PASS');
    const senderEmail = Deno.env.get('SENDER_EMAIL') || 'no-reply@altogetheragile.com';
    const senderName = Deno.env.get('SENDER_NAME') || 'AltogetherAgile';

    if (!smtpUsername || !smtpPassword) {
      throw new Error('SMTP credentials not configured');
    }

    console.log(`Sending test email to ${recipient} from ${senderEmail}`);

    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: smtpHostname,
      port: smtpPort,
      username: smtpUsername,
      password: smtpPassword,
    });

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
    
    console.log('Test email sent successfully:', result);

    return new Response(
      JSON.stringify({ success: true, message: "Test email sent successfully" }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message,
          hint: 'Check your SMTP configuration and ensure all required environment variables are set.'
        }
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
