import { supabase } from "@/integrations/supabase/client";

// Google OAuth configuration
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";

// Dynamic redirect URI determination
const getRedirectUri = () => {
  // Use the current origin plus /auth/google/callback path for the redirect
  return window.location.origin + "/auth/google/callback";
};

// Scopes needed for Drive operations
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
].join(" ");

// Credentials management
let clientId: string | null = null;
let clientSecret: string | null = null;
let credentialsPromise: Promise<boolean> | null = null;
let credentialsLastFetched: number | null = null;
let credentialsRetryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const CREDENTIALS_TTL = 5 * 60 * 1000;

/**
 * Initialize Google credentials
 */
const initializeCredentials = async (forceRefresh = false): Promise<boolean> => {
  if (
    !forceRefresh &&
    clientId && 
    clientSecret && 
    credentialsLastFetched && 
    Date.now() - credentialsLastFetched < CREDENTIALS_TTL
  ) {
    console.log("Using cached Google credentials");
    return true;
  }

  if (forceRefresh) {
    credentialsRetryCount = 0;
  }
  
  if (credentialsRetryCount >= MAX_RETRIES) {
    console.error(`Failed to fetch Google credentials after ${MAX_RETRIES} retries`);
    return false;
  }
  
  try {
    console.log("Fetching Google credentials from edge function...");
    credentialsRetryCount++;
    
    const response = await supabase.functions.invoke("get-google-credentials", {
      method: "GET",
    });
    
    if (response.error) {
      console.error("Error fetching Google credentials:", response.error);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return initializeCredentials(false);
    }
    
    const data = response.data;
    console.log("Received credential response:", JSON.stringify(data, null, 2));
    
    if (data && data.clientId && data.clientSecret) {
      clientId = data.clientId;
      clientSecret = data.clientSecret;
      credentialsLastFetched = Date.now();
      console.log("Google credentials loaded successfully");
      console.log(`Client ID: ${clientId.substring(0, 10)}...`);
      return true;
    }
    
    console.error("Invalid Google credentials received", data);
    return false;
  } catch (error) {
    console.error("Failed to initialize Google credentials:", error);
    return false;
  }
};

/**
 * Get credentials with caching
 */
const getCredentials = async (forceRefresh = false): Promise<boolean> => {
  if (!credentialsPromise || forceRefresh) {
    credentialsPromise = initializeCredentials(forceRefresh);
  }
  return await credentialsPromise;
};

/**
 * Generate OAuth URL for user authorization
 */
export const getGoogleAuthUrl = async () => {
  const success = await getCredentials();
  if (!success || !clientId) {
    throw new Error("Google API client ID not available");
  }
  
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem("googleOAuthState", state);
  
  // Get the redirect URI
  const redirectUri = getRedirectUri();
  console.log("Using redirect URI:", redirectUri);
  
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUri);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES);
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("prompt", "consent");
  authUrl.searchParams.append("include_granted_scopes", "true");
  
  const finalUrl = authUrl.toString();
  console.log("Generated Google Auth URL:", finalUrl);
  
  return finalUrl;
};

/**
 * Process the authorization code from Google OAuth redirect
 */
export const handleGoogleRedirect = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const storedState = localStorage.getItem("googleOAuthState");
  
  window.history.replaceState({}, document.title, window.location.pathname);
  
  if (!code || state !== storedState) {
    throw new Error("Invalid OAuth state or missing code");
  }
  
  localStorage.removeItem("googleOAuthState");
  return await exchangeCodeForTokens(code);
};

/**
 * Exchange authorization code for access and refresh tokens
 */
const exchangeCodeForTokens = async (code: string) => {
  const success = await getCredentials();
  
  if (!success || !clientId || !clientSecret) {
    throw new Error("Google API credentials not available");
  }
  
  // Get the same redirect URI that was used for the auth request
  const redirectUri = getRedirectUri();
  console.log("Using redirect URI for token exchange:", redirectUri);
  
  const tokenResponse = await supabase.functions.invoke("google-token-exchange", {
    method: "POST",
    body: {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    },
  });

  if (tokenResponse.error) {
    console.error("Token exchange error:", tokenResponse.error);
    throw new Error(`Token exchange failed: ${tokenResponse.error.message}`);
  }
  
  console.log("Token exchange successful");
  const { access_token, refresh_token, expires_in } = tokenResponse.data;
  
  const tokenExpiry = Date.now() + (expires_in * 1000);
  localStorage.setItem("googleAccessToken", access_token);
  localStorage.setItem("googleRefreshToken", refresh_token);
  localStorage.setItem("googleTokenExpiry", tokenExpiry.toString());
  
  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: tokenExpiry
  };
};

/**
 * Get a valid access token, refreshing if necessary
 */
export const getAccessToken = async (): Promise<string> => {
  const accessToken = localStorage.getItem("googleAccessToken");
  const refreshToken = localStorage.getItem("googleRefreshToken");
  const tokenExpiry = localStorage.getItem("googleTokenExpiry");
  
  if (!accessToken || !refreshToken) {
    throw new Error("Not authenticated with Google Drive");
  }
  
  if (tokenExpiry && parseInt(tokenExpiry) > Date.now() + 60000) {
    return accessToken;
  }
  
  const success = await getCredentials();
  if (!success || !clientId || !clientSecret) {
    throw new Error("Google API credentials not available");
  }
  
  const refreshResponse = await supabase.functions.invoke("google-token-refresh", {
    method: "POST",
    body: {
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token"
    },
  });
  
  if (refreshResponse.error) {
    localStorage.removeItem("googleAccessToken");
    localStorage.removeItem("googleRefreshToken");
    localStorage.removeItem("googleTokenExpiry");
    throw new Error("Session expired, please re-authenticate with Google");
  }
  
  const { access_token, expires_in } = refreshResponse.data;
  const newExpiry = Date.now() + (expires_in * 1000);
  
  localStorage.setItem("googleAccessToken", access_token);
  localStorage.setItem("googleTokenExpiry", newExpiry.toString());
  
  return access_token;
};

/**
 * Check if the user is authenticated with Google
 */
export const isGoogleAuthenticated = () => {
  return !!localStorage.getItem("googleAccessToken") && 
         !!localStorage.getItem("googleRefreshToken");
};
