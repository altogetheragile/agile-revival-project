
import React from "react";
import { EmailTester } from "./EmailTester";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ServicesSettings() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Email Services</h2>
        
        <Alert>
          <Mail className="h-4 w-4 mr-2" />
          <AlertDescription className="text-sm">
            <p className="font-medium mb-2">Your application uses two email delivery methods:</p>
            <ul className="list-disc pl-5 mb-3 space-y-1">
              <li>
                <span className="font-medium">Supabase SMTP:</span> Used for built-in authentication emails (configured in Auth settings)
              </li>
              <li>
                <span className="font-medium">Resend API:</span> Used as a backup and for custom emails via edge functions
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://resend.com/domains', '_blank')}
                className="h-8 text-xs"
              >
                Verify Domain in Resend <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://supabase.com/dashboard/project/ctsjvuoucopnederhkko/auth/templates', '_blank')}
                className="h-8 text-xs"
              >
                Email Templates <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('https://supabase.com/dashboard/project/ctsjvuoucopnederhkko/settings/functions', '_blank')}
                className="h-8 text-xs"
              >
                Manage API Keys <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <h3 className="flex items-center text-sm font-medium text-amber-800 mb-2">
            <ArrowRight className="h-4 w-4 mr-1" />
            Troubleshooting Gmail SMTP Issues
          </h3>
          <ol className="list-decimal pl-5 text-sm text-amber-700 space-y-1">
            <li>Ensure "Less secure app access" is enabled in your Google account</li>
            <li>Or create an <a href="https://myaccount.google.com/apppasswords" target="_blank" className="underline">App Password</a> if using 2FA</li>
            <li>Check that the SMTP server address is <code className="bg-amber-100 px-1 rounded">smtp.gmail.com</code></li>
            <li>Verify port 465 (SSL) or 587 (TLS) is not blocked by your firewall</li>
          </ol>
        </div>
        
        <Separator className="my-2" />
        
        <EmailTester />
      </div>
    </div>
  );
}
