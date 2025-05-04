
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }
}

// Check if Supabase environment variables are set
const checkEnv = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error('Missing environment variables. Please set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.')
  }
  
  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceKey
  }
}

serve(async (req) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req)
    if (corsResponse) {
      return corsResponse
    }

    // Get environment variables
    const { supabaseUrl, supabaseServiceKey } = checkEnv()

    // Create Supabase client with service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const { email, redirectUrl } = await req.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      throw new Error('Valid email is required')
    }

    // Set default redirect URL if not provided
    const finalRedirectUrl = redirectUrl || `${req.headers.get('origin')}/reset-password`

    console.log(`Processing password reset for ${email} with redirect to ${finalRedirectUrl}`)

    // Send password reset email using admin privileges
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: finalRedirectUrl,
    })

    if (error) {
      console.error('Error sending password reset:', error)
      throw error
    }

    console.log('Password reset email sent successfully')

    // For security, don't confirm if the email exists or not
    return new Response(JSON.stringify({ 
      message: 'If an account exists with this email, a password reset link has been sent' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Password reset error:', error)
    
    // For security, return a generic success message even on error
    return new Response(JSON.stringify({ 
      message: 'If an account exists with this email, a password reset link has been sent' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
