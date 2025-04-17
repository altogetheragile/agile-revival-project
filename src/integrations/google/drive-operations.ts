
import { getAccessToken } from './auth';

// Google Drive API endpoint
const GOOGLE_API_URL = "https://www.googleapis.com/drive/v3";

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (folderName: string, parentFolderId?: string) => {
  const accessToken = await getAccessToken();
  
  const metadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    ...(parentFolderId && { parents: [parentFolderId] })
  };
  
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
    
    return await response.json();
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
