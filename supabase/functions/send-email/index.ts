
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

    const html = await renderAsync(
      WelcomeEmail({ firstName, email })
    );

    console.log(`Sending welcome email to ${email} using sender: ${SENDER_NAME} <${SENDER_EMAIL}>`);

    const result = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [email],
      subject: 'Welcome to Our Platform!',
      html: html,
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
