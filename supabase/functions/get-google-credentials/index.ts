
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  console.log("Google credentials function called");
  
  // Get the credentials from environment variables
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  
  if (!clientId || !clientSecret) {
    console.error("Google API credentials not configured in Edge Function secrets");
    return new Response(
      JSON.stringify({ error: "Google API credentials not configured" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  console.log(`Returning Google credentials to client (ID: ${clientId.substring(0, 5)}...)`);
  
  // Return credentials with proper naming
  return new Response(
    JSON.stringify({
      clientId: clientId,
      clientSecret: clientSecret
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
