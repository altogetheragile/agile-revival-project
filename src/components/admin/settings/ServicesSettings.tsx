
import React from "react";
import { EmailTester } from "./EmailTester";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesSettings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Email Services</h2>
        
        <Alert>
          <AlertDescription className="text-sm">
            Your application uses Resend for email delivery. Make sure your sender domain is verified 
            at Resend.com and your SENDER_EMAIL secret in Supabase matches that domain.
            
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://resend.com/domains', '_blank')}
                className="h-8 text-xs"
              >
                Verify Domain <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://supabase.com/dashboard/project/ctsjvuoucopnederhkko/settings/functions', '_blank')}
                className="h-8 text-xs"
              >
                Manage Secrets <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        <EmailTester />
      </div>
    </div>
  );
}
