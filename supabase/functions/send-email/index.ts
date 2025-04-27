
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import ResetPasswordEmail from "./_templates/reset-password-email.tsx";
import { renderToString } from "npm:react-dom@18.3.1/server";
import React from "npm:react@18.3.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a simple connection pool to avoid creating a new connection for each request
const clientPool: {client?: SmtpClient, inUse: boolean, lastUsed: number} = {
  client: undefined,
  inUse: false,
  lastUsed: 0
};

// SMTP connection timeout in milliseconds
const SMTP_CONNECTION_TIMEOUT = 8000;
// SMTP pool max idle time in milliseconds (5 minutes)
const SMTP_POOL_MAX_IDLE_TIME = 300000;

// Function to get an SMTP client (either from pool or create new one)
async function getSmtpClient(): Promise<SmtpClient> {
  const now = Date.now();
  
  // If there's a client in the pool that's not in use and not expired
  if (clientPool.client && !clientPool.inUse && (now - clientPool.lastUsed) < SMTP_POOL_MAX_IDLE_TIME) {
    console.log('Using SMTP client from pool');
    clientPool.inUse = true;
    return clientPool.client;
  }
  
  // If there's an expired client in the pool, close it
  if (clientPool.client && (now - clientPool.lastUsed) >= SMTP_POOL_MAX_IDLE_TIME) {
    console.log('Closing expired SMTP client');
    try {
      await clientPool.client.close();
    } catch (error) {
      console.error('Error closing expired client:', error);
    }
    clientPool.client = undefined;
  }
  
  // Create a new client
  console.log('Creating new SMTP client');
  const client = new SmtpClient();
  clientPool.client = client;
  clientPool.inUse = true;
  
  return client;
}

// Function to release an SMTP client back to the pool
function releaseSmtpClient() {
  clientPool.inUse = false;
  clientPool.lastUsed = Date.now();
  console.log('Released SMTP client back to pool');
}

// Function to connect to SMTP server with timeout
async function connectWithTimeout(client: SmtpClient, config: any): Promise<boolean> {
  return Promise.race([
    (async () => {
      try {
        console.log(`Connecting to SMTP server ${config.hostname}:${config.port} with timeout ${SMTP_CONNECTION_TIMEOUT}ms`);
        await client.connectTLS(config);
        console.log('SMTP connection successful');
        return true;
      } catch (error) {
        console.error('SMTP connection failed:', error);
        throw error;
      }
    })(),
    new Promise<boolean>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`SMTP connection timed out after ${SMTP_CONNECTION_TIMEOUT}ms`));
      }, SMTP_CONNECTION_TIMEOUT);
    })
  ]);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let client: SmtpClient | undefined;
  
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
    const smtpHostname = Deno.env.get('SMTP_HOST') || 'smtp.eu.mailgun.org';
    const smtpPortStr = Deno.env.get('SMTP_PORT') || '465';
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
      console.log('Processing password reset request with retry logic');
      
      const email = body.email || body.recipient;
      if (!email) {
        throw new Error('No recipient email specified for password reset');
      }
      
      const resetLink = body.resetLink || `${Deno.env.get('PUBLIC_URL') || 'https://altogetheragile.com'}/reset-password?email=${encodeURIComponent(email)}`;
      console.log(`Reset link for ${email}: ${resetLink}`);
      
      // Implement retry logic for SMTP connection
      let connected = false;
      let retryCount = 0;
      const MAX_RETRIES = 2;
      
      while (!connected && retryCount <= MAX_RETRIES) {
        try {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount} for SMTP connection`);
            // Add exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          }
          
          // Get SMTP client (from pool or create new one)
          client = await getSmtpClient();
          
          // Connect with timeout
          await connectWithTimeout(client, {
            hostname: smtpHostname,
            port: smtpPort,
            username: smtpUsername,
            password: smtpPassword,
          });
          
          connected = true;
        } catch (connError) {
          console.error(`Connection attempt ${retryCount + 1} failed:`, connError);
          retryCount++;
          
          if (retryCount > MAX_RETRIES) {
            throw new Error(`Failed to connect to SMTP server after ${MAX_RETRIES + 1} attempts: ${connError.message}`);
          }
        }
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
        
        // Implement send with timeout
        const sendEmailPromise = client.send({
          from: senderName ? `${senderName} <${senderEmail}>` : senderEmail,
          to: email,
          subject: "Reset Your AltogetherAgile Password",
          content: emailHtml,
          html: true,
        });
        
        // Set timeout for send operation
        const result = await Promise.race([
          sendEmailPromise,
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Email sending timed out")), 10000);
          })
        ]);
        
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
          // Release the client back to the pool instead of closing it
          if (client) {
            releaseSmtpClient();
          }
        } catch (closeError) {
          console.error('Error releasing SMTP connection:', closeError);
        }
      }
    }
    
    // Check if this is a test email request
    else if (body.type === 'test') {
      console.log('Sending test email');
      
      if (!body.recipient) {
        throw new Error('No recipient email specified for test email');
      }
      
      let connected = false;
      let retryCount = 0;
      const MAX_RETRIES = 2;
      
      while (!connected && retryCount <= MAX_RETRIES) {
        try {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount} for test email SMTP connection`);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          }
          
          // Get SMTP client
          client = await getSmtpClient();
          
          // Connect with timeout
          await connectWithTimeout(client, {
            hostname: smtpHostname,
            port: smtpPort,
            username: smtpUsername,
            password: smtpPassword,
          });
          
          connected = true;
        } catch (connError) {
          console.error(`Test email connection attempt ${retryCount + 1} failed:`, connError);
          retryCount++;
          
          if (retryCount > MAX_RETRIES) {
            throw new Error(`Failed to connect to SMTP server for test email after ${MAX_RETRIES + 1} attempts: ${connError.message}`);
          }
        }
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
              <li><strong>SMTP Server:</strong> ${smtpHostname}:${smtpPort}</li>
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
        if (client) {
          releaseSmtpClient();
        }
      }
    } 
    
    // Handle custom emails (e.g. welcome emails, notifications)
    else if (body.type === 'custom') {
      const { recipient, subject, htmlContent, textContent } = body;
      
      if (!recipient) {
        throw new Error('No recipient email specified for custom email');
      }
      
      let connected = false;
      let retryCount = 0;
      const MAX_RETRIES = 2;
      
      while (!connected && retryCount <= MAX_RETRIES) {
        try {
          if (retryCount > 0) {
            console.log(`Retry attempt ${retryCount} for custom email SMTP connection`);
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
          }
          
          // Get SMTP client
          client = await getSmtpClient();
          
          // Connect with timeout
          await connectWithTimeout(client, {
            hostname: smtpHostname,
            port: smtpPort,
            username: smtpUsername,
            password: smtpPassword,
          });
          
          connected = true;
        } catch (connError) {
          console.error(`Custom email connection attempt ${retryCount + 1} failed:`, connError);
          retryCount++;
          
          if (retryCount > MAX_RETRIES) {
            throw new Error(`Failed to connect to SMTP server for custom email after ${MAX_RETRIES + 1} attempts: ${connError.message}`);
          }
        }
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
        if (client) {
          releaseSmtpClient();
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
    
    // Clean up connection if needed
    if (client && clientPool.inUse) {
      try {
        releaseSmtpClient();
      } catch (e) {
        console.error('Error while cleaning up SMTP client:', e);
      }
    }
    
    // Determine if it's a configuration error
    const isConfigError = error.message?.includes('not configured') || 
                          error.message?.includes('credentials') ||
                          error.message?.includes('SMTP_');
    
    // Determine if it's a connection error
    const isConnectionError = error.message?.includes('connect') ||
                              error.message?.includes('timed out') ||
                              error.message?.includes('network');
    
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        type: isConfigError ? 'configuration' : isConnectionError ? 'connection' : 'sending',
        hint: isConfigError 
          ? 'Check your SMTP configuration in Supabase settings and ensure all required environment variables are set.'
          : isConnectionError
            ? 'There was an error connecting to the SMTP server. Check your network, server address, and credentials.'
            : 'There was an error sending the email. Check the Edge Function logs for more details.'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: isConfigError ? 400 : 500
    });
  }
});

// Add event listener for function shutdown to clean up resources
addEventListener('beforeunload', () => {
  if (clientPool.client) {
    try {
      console.log("Function shutting down, closing SMTP connection");
      clientPool.client.close();
    } catch (e) {
      console.error("Error closing SMTP connection during shutdown:", e);
    }
  }
});
