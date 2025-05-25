
// This service is obsolete since course materials are now managed through Google Drive
// Materials are linked via googleDriveFolderId and googleDriveFolderUrl on the course record
// Individual file management happens directly through Google Drive APIs

// If you need to work with course materials, use the Google Drive integration instead
// The course record contains:
// - googleDriveFolderId: string - ID of the Google Drive folder containing materials
// - googleDriveFolderUrl: string - Direct URL to the Google Drive folder

// This file is kept for backward compatibility but should not be used
// Consider using the Google Drive hooks and services in src/hooks/google-drive/ instead

export const deprecatedCourseMaterialService = {
  notice: "This service is deprecated. Use Google Drive integration for course materials."
};
