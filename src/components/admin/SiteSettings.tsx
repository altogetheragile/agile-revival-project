
import React from "react";
import { GoogleDriveSettings } from "./settings/GoogleDriveSettings";

const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Site Settings</h2>
      <GoogleDriveSettings />
    </div>
  );
};

export default SiteSettings;
