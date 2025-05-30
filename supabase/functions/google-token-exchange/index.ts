
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { code, client_id, client_secret, redirect_uri, grant_type } = await req.json();
    
    if (!code || !client_id || !client_secret || !redirect_uri || !grant_type) {
      console.error("Missing required parameters", { code: !!code, client_id: !!client_id, client_secret: !!client_secret, redirect_uri: !!redirect_uri, grant_type });
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing token exchange with code: ${code.substring(0, 5)}...`);
    console.log(`Redirect URI: ${redirect_uri}`);
    
    // Exchange code for tokens with Google OAuth
    const formData = new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type
    });
    
    console.log("Sending token request to Google OAuth");
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Google OAuth token exchange error:", data);
      return new Response(
        JSON.stringify({ error: data.error, description: data.error_description }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Token exchange successful");
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Token exchange function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
