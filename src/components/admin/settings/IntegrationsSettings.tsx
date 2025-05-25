
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleDriveSettings } from "./GoogleDriveSettings";

export const IntegrationsSettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Integrations</CardTitle>
          <CardDescription>
            Manage connections to external services and platforms to enhance your site's functionality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <GoogleDriveSettings />
            
            {/* Future integrations can be added here */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Additional Integrations
              </h3>
              <p className="text-sm text-muted-foreground">
                More integrations will be available in future updates (Zapier, email services, etc.)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
