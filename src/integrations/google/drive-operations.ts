import { getAccessToken } from './auth';

// Google Drive API endpoint
const GOOGLE_API_URL = "https://www.googleapis.com/drive/v3";

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (folderName: string, parentFolderId?: string) => {
  const accessToken = await getAccessToken();
  
  console.log(`Creating folder: ${folderName}`, parentFolderId ? `with parent: ${parentFolderId}` : 'without parent');
  console.log(`Using access token: ${accessToken.substring(0, 10)}...`);
  
  const metadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    ...(parentFolderId && { parents: [parentFolderId] })
  };
  
  try {
    console.log("Sending folder creation request with metadata:", JSON.stringify(metadata));
    
    const response = await fetch(`${GOOGLE_API_URL}/files`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(metadata)
    });
    
    const responseText = await response.text();
    console.log(`Folder creation response status: ${response.status}`);
    console.log(`Folder creation response headers:`, Object.fromEntries(response.headers.entries()));
    console.log(`Folder creation response body: ${responseText}`);
    
    if (!response.ok) {
      console.error("Failed to create folder. Status:", response.status, "Response:", responseText);
      // Parse the error response if it's valid JSON
      try {
        const errorJson = JSON.parse(responseText);
        let errorMessage = `Failed to create folder: (${response.status})`;
        
        // Check for specific API-not-enabled error
        if (
          errorJson?.error?.status === "PERMISSION_DENIED" && 
          errorJson?.error?.message?.includes("has not been used in project") &&
          errorJson?.error?.message?.includes("drive.googleapis.com")
        ) {
          // Pass through the complete Google error message with the activation URL
          throw new Error(responseText);
        } else {
          errorMessage = `${errorMessage} ${responseText}`;
        }
        
        throw new Error(errorMessage);
      } catch (jsonError) {
        // If error isn't valid JSON or we failed to parse it, throw original error
        if (jsonError instanceof SyntaxError) {
          throw new Error(`Failed to create folder: (${response.status}) ${responseText}`);
        }
        throw jsonError; // Re-throw if it's our custom error
      }
    }
    
    // Parse the response back to JSON after logging it as text
    const folder = JSON.parse(responseText);
    console.log("Folder created:", folder);
    
    // Make the folder accessible via a link
    console.log(`Setting permissions for folder ${folder.id}...`);
    const permissionResponse = await fetch(`${GOOGLE_API_URL}/files/${folder.id}/permissions`, {
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
    
    const permissionResponseText = await permissionResponse.text();
    console.log(`Permission response status: ${permissionResponse.status}`);
    console.log(`Permission response: ${permissionResponseText}`);
    
    if (!permissionResponse.ok) {
      console.warn("Could not set folder permissions:", permissionResponseText);
    }
    
    // Get the folder URL
    console.log(`Getting details for folder ${folder.id}...`);
    const folderResponse = await fetch(
      `${GOOGLE_API_URL}/files/${folder.id}?fields=id,name,webViewLink`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (!folderResponse.ok) {
      const folderErrorText = await folderResponse.text();
      console.error(`Could not get folder details: ${folderResponse.status}`, folderErrorText);
      throw new Error(`Could not get folder details: ${folderResponse.statusText}`);
    }
    
    const folderDetails = await folderResponse.json();
    console.log("Folder details:", folderDetails);
    
    return folderDetails;
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
  
  const metadata = {
    name: file.name,
    parents: [folderId]
  };
  
  try {
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
    
    const uploadUrl = metadataResponse.headers.get("Location");
    if (!uploadUrl) {
      throw new Error("Failed to get upload URL");
    }
    
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
