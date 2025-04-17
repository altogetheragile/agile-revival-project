
import { supabase } from "@/integrations/supabase/client";

// Google Drive API endpoints
const GOOGLE_API_URL = "https://www.googleapis.com/drive/v3";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/auth";
const REDIRECT_URI = window.location.origin + "/admin";

// Scopes needed for Drive file operations
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
].join(" ");

// Retrieve credentials from Supabase edge function
let clientId: string | null = null;
let clientSecret: string | null = null;
let credentialsPromise: Promise<boolean> | null = null;
let credentialsLastFetched: number | null = null;
let credentialsRetryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const CREDENTIALS_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize Google Drive credentials
 * This is called when needed with retry and caching logic
 */
const initializeCredentials = async (forceRefresh = false): Promise<boolean> => {
  // Return cached credentials if they exist and aren't expired
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

  // Reset retry count when forcing refresh
  if (forceRefresh) {
    credentialsRetryCount = 0;
  }
  
  // Limit retries
  if (credentialsRetryCount >= MAX_RETRIES) {
    console.error(`Failed to fetch Google credentials after ${MAX_RETRIES} retries`);
    return false;
  }
  
  try {
    console.log("Fetching Google credentials from edge function...");
    credentialsRetryCount++;
    
    const { data, error } = await supabase.functions.invoke("get-google-credentials", {
      method: "GET",
    });
    
    if (error) {
      console.error("Error fetching Google credentials:", error);
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return initializeCredentials(false);
    }
    
    if (data && data.clientId && data.clientSecret) {
      clientId = data.clientId;
      clientSecret = data.clientSecret;
      credentialsLastFetched = Date.now();
      console.log("Google credentials loaded successfully");
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
    throw new Error("Google API client ID not available. Please check your API credentials in Supabase Edge Function settings.");
  }
  
  // Create a random state to prevent CSRF
  const state = Math.random().toString(36).substring(2, 15);
  localStorage.setItem("googleOAuthState", state);
  
  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES);
  authUrl.searchParams.append("access_type", "offline");
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("prompt", "consent");
  
  return authUrl.toString();
};

/**
 * Process the authorization code from Google OAuth redirect
 */
export const handleGoogleRedirect = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const storedState = localStorage.getItem("googleOAuthState");
  
  // Clean up URL without refreshing the page
  window.history.replaceState({}, document.title, window.location.pathname);
  
  // Verify state to prevent CSRF attacks
  if (!code || state !== storedState) {
    throw new Error("Invalid OAuth state or missing code");
  }
  
  localStorage.removeItem("googleOAuthState");
  
  // Exchange code for tokens
  return await exchangeCodeForTokens(code);
};

/**
 * Exchange authorization code for access and refresh tokens
 */
const exchangeCodeForTokens = async (code: string) => {
  const success = await getCredentials();
  
  if (!success || !clientId || !clientSecret) {
    throw new Error("Google API credentials not available. Please check your API credentials in Supabase Edge Function settings.");
  }
  
  const tokenResponse = await supabase.functions.invoke("google-token-exchange", {
    method: "POST",
    body: {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code"
    },
  });

  if (tokenResponse.error) {
    throw new Error(`Token exchange failed: ${tokenResponse.error.message}`);
  }
  
  const { access_token, refresh_token, expires_in } = tokenResponse.data;
  
  // Store tokens
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
  
  // If no tokens, need to authenticate
  if (!accessToken || !refreshToken) {
    throw new Error("Not authenticated with Google Drive");
  }
  
  // If token is still valid, return it
  if (tokenExpiry && parseInt(tokenExpiry) > Date.now() + 60000) {
    return accessToken;
  }
  
  // Otherwise refresh the token
  const success = await getCredentials();
  if (!success || !clientId || !clientSecret) {
    throw new Error("Google API credentials not available. Please check your API credentials in Supabase Edge Function settings.");
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
    // If refresh fails, we need to re-authenticate
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

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (folderName: string, parentFolderId?: string) => {
  const accessToken = await getAccessToken();
  
  // Create folder metadata
  const metadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder"
  };
  
  if (parentFolderId) {
    Object.assign(metadata, { parents: [parentFolderId] });
  }
  
  try {
    const response = await fetch(`${GOOGLE_API_URL}/files`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metadata)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create folder: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating Google Drive folder:", error);
    throw error;
  }
};

/**
 * Upload a file to Google Drive
 */
export const uploadFileToDrive = async (
  file: File, 
  folderId: string,
  onProgress?: (progress: number) => void
) => {
  const accessToken = await getAccessToken();
  
  // Create file metadata
  const metadata = {
    name: file.name,
    parents: [folderId]
  };
  
  try {
    // First, create the file metadata
    const metadataResponse = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metadata)
    });
    
    if (!metadataResponse.ok) {
      throw new Error(`Failed to initialize upload: ${metadataResponse.statusText}`);
    }
    
    // Get the resumable upload URL
    const uploadUrl = metadataResponse.headers.get("Location");
    if (!uploadUrl) {
      throw new Error("Failed to get upload URL");
    }
    
    // Upload the file
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "Content-Length": `${file.size}`
      },
      body: file
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }
    
    const fileData = await uploadResponse.json();
    
    // Make the file viewable by anyone with the link
    const permissionResponse = await fetch(`${GOOGLE_API_URL}/files/${fileData.id}/permissions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone"
      })
    });
    
    if (!permissionResponse.ok) {
      console.warn("Could not set file permissions", await permissionResponse.text());
    }
    
    // Get the web view link
    const fileResponse = await fetch(`${GOOGLE_API_URL}/files/${fileData.id}?fields=id,name,mimeType,webViewLink,webContentLink,size`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (!fileResponse.ok) {
      throw new Error("Could not get file details");
    }
    
    return await fileResponse.json();
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
};

/**
 * Get folder details including files
 */
export const getFolderContents = async (folderId: string) => {
  const accessToken = await getAccessToken();
  
  try {
    const response = await fetch(
      `${GOOGLE_API_URL}/files?q='${folderId}' in parents&fields=files(id,name,mimeType,webViewLink,webContentLink,size)`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get folder contents: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting Google Drive folder contents:", error);
    throw error;
  }
};
