
import React, { useState } from "react";
import { EmailTester } from "./EmailTester";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Mail, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseTemplatesSettings } from "./CourseTemplatesSettings";

export function ServicesSettings() {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 gap-4">
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Services
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Event Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Email Services</h2>
            
            <Alert>
              <Mail className="h-4 w-4 mr-2" />
              <AlertDescription className="text-sm">
                <p className="font-medium mb-2">Your application uses Mailgun for all email delivery:</p>
                <ul className="list-disc pl-5 mb-3 space-y-1">
                  <li>
                    <span className="font-medium">Authentication Emails:</span> Password resets, email confirmations, and magic links
                  </li>
                  <li>
                    <span className="font-medium">Notification Emails:</span> System notifications and alerts
                  </li>
                  <li>
                    <span className="font-medium">Custom Emails:</span> All custom emails are managed through Supabase using Mailgun
                  </li>
                </ul>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('https://app.mailgun.com/app/domains', '_blank')}
                    className="h-8 text-xs"
                  >
                    Mailgun Dashboard <ExternalLink className="h-3 w-3 ml-1" />
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
                    onClick={() => window.open('https://supabase.com/dashboard/project/ctsjvuoucopnederhkko/settings/auth', '_blank')}
                    className="h-8 text-xs"
                  >
                    Auth Settings <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <h3 className="flex items-center text-sm font-medium text-amber-800 mb-2">
                <ArrowRight className="h-4 w-4 mr-1" />
                Troubleshooting Mailgun SMTP Issues
              </h3>
              <ol className="list-decimal pl-5 text-sm text-amber-700 space-y-1">
                <li>Verify your sending domain is properly configured in Mailgun</li>
                <li>Ensure SMTP credentials are correctly set in Supabase Auth settings</li>
                <li>Check if you're within your sending limits on your Mailgun plan</li>
                <li>Verify deliverability by checking message logs in Mailgun dashboard</li>
              </ol>
            </div>
            
            <Separator className="my-2" />
            
            <EmailTester />
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight">Event Templates</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Create and manage templates for different types of events and courses. 
              Use these templates to quickly schedule new events with consistent details.
            </p>
            
            <CourseTemplatesSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
