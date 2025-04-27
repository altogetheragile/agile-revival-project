import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Alert,
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Info, Mail, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function EmailTester() {
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("test");

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Please enter a recipient email address";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const sendTestEmail = async () => {
    const validationError = validateEmail(recipient);
    if (validationError) {
      setLastError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSending(true);
      setLastError(null);
      
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: { recipient }
      });
      
      if (error) throw error;
      
      toast.success("Test email sent successfully! Please check your inbox or spam folder.");
      setShowEmailInfo(true);
      setLastError(null);
      
      console.log('Standard test email sent through edge function');
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      const errorMessage = error.message || "Failed to send email";
      setLastError(errorMessage);
      toast.error("Failed to send email: " + errorMessage);
    } finally {
      setSending(false);
    }
  };
  
  const sendTestPasswordReset = async () => {
    const validationError = validateEmail(recipient);
    if (validationError) {
      setLastError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSending(true);
      setLastError(null);
      
      const resetUrl = `${window.location.origin}/reset-password`;
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(recipient, {
        redirectTo: resetUrl
      });
      
      if (supabaseError) throw supabaseError;
      
      toast.success("Password reset email sent. Check your inbox or spam folder.");
      setShowEmailInfo(true);
      setLastError(null);
      
      console.log('Password reset test completed');
    } catch (error: any) {
      console.error('Failed to send password reset test:', error);
      const errorMessage = error.message || "Failed to send password reset email";
      setLastError(errorMessage);
      toast.error("Failed to send password reset email: " + errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Test Email Configuration</h3>
      
      {lastError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Email Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{lastError}</p>
            <p className="text-sm">
              Common solutions:
              <ul className="list-disc pl-5 mt-1">
                <li>Check your Mailgun configuration in Supabase</li>
                <li>Verify your sender domain is properly configured</li>
                <li>Make sure the recipient email address is valid</li>
              </ul>
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {showEmailInfo && !lastError && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Email Sent!</AlertTitle>
          <AlertDescription>
            Please check your inbox or spam folder. If you don't see the email, check the Mailgun logs in 
            the Mailgun dashboard for more details.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="test" className="flex-1">Standard Test Email</TabsTrigger>
          <TabsTrigger value="password-reset" className="flex-1">Password Reset Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test" className="mt-4">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              Send a standard test email to verify your Mailgun configuration is working.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter recipient email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="max-w-md"
                required
              />
              <Button 
                onClick={sendTestEmail}
                disabled={sending || !recipient.trim()}
              >
                {sending ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              This will send a test email using Mailgun through Supabase.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="password-reset" className="mt-4">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              Test the password reset email flow specifically. This will send a real password reset email.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="email"
                placeholder="Email address for password reset test"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="max-w-md"
                required
              />
              <Button 
                onClick={sendTestPasswordReset}
                disabled={sending || !recipient.trim()}
                variant="secondary"
              >
                {sending ? 'Sending...' : 'Test Password Reset'}
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              This will send a password reset email using Supabase's built-in authentication email system.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-gray-500 pt-4 border-t mt-4">
        Your emails are configured to use Mailgun through Supabase. For delivery issues,
        check your domain verification status and SMTP settings in the Supabase and Mailgun dashboards.
      </p>
    </div>
  );
}
