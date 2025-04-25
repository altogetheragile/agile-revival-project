
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [testPasswordReset, setTestPasswordReset] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("test");
  const { toast } = useToast();

  const sendTestEmail = async () => {
    try {
      setSending(true);
      setLastError(null);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'test',
          recipient: recipient || undefined
        }
      });
      
      if (error) throw error;
      
      // Check for any error in the data response
      if (data && data.error) {
        throw new Error(data.error.message || "Failed to send email");
      }

      toast({
        title: "Test email sent",
        description: "Please check your inbox or spam folder",
      });
      
      console.log('Email send result:', data);
      setShowEmailInfo(true);
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      
      let errorMessage = error.message || "Unknown error";
      
      // Check for common domain verification errors
      if (errorMessage.includes("domain is not verified")) {
        errorMessage = "Domain not verified in Resend. Verify your domain at https://resend.com/domains";
      } else if (errorMessage.includes("bounced") || errorMessage.includes("rejected")) {
        errorMessage = "Email bounced. The recipient's mail server rejected the email. Verify that the recipient address exists and check your sender domain configuration.";
      }
      
      setLastError(errorMessage);
      
      toast({
        title: "Failed to send email",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };
  
  const sendTestPasswordReset = async () => {
    try {
      if (!recipient) {
        toast({
          title: "Email required",
          description: "Please enter a recipient email address",
          variant: "destructive"
        });
        return;
      }
      
      setSending(true);
      setLastError(null);
      setTestPasswordReset(true);
      
      // First try Supabase's built-in password reset
      const resetUrl = `${window.location.origin}/reset-password`;
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(recipient, {
        redirectTo: resetUrl
      });
      
      if (supabaseError) {
        console.log('Supabase password reset failed, trying edge function:', supabaseError);
        
        // Try edge function as backup
        const { data, error: functionError } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'reset_password',
            email: recipient,
            actionLink: resetUrl,
            recipient: recipient
          }
        });
        
        if (functionError) throw functionError;
        if (data && data.error) throw new Error(data.error.message);
        
        toast({
          title: "Password reset email sent via edge function",
          description: "Check your inbox or spam folder"
        });
      } else {
        toast({
          title: "Password reset email sent via Supabase",
          description: "Check your inbox or spam folder"
        });
      }
      
      setShowEmailInfo(true);
      console.log('Password reset test completed');
      
    } catch (error: any) {
      console.error('Failed to send password reset test:', error);
      setLastError(error.message || "Unknown error");
      
      toast({
        title: "Failed to send password reset email",
        description: error.message || "Unknown error",
        variant: "destructive"
      });
    } finally {
      setSending(false);
      setTestPasswordReset(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Test Email Configuration</h3>
      
      {lastError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Email Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{lastError}</p>
            <p className="text-sm">
              Common solutions:
              <ul className="list-disc pl-5 mt-1">
                <li>Verify your domain in Resend.com</li>
                <li>Make sure your SENDER_EMAIL secret matches a verified domain</li>
                <li>Check if the recipient email address exists</li>
                <li>For Gmail SMTP, ensure "Less secure app access" is enabled or use an app password</li>
              </ul>
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {showEmailInfo && !lastError && (
        <Alert variant="default" className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Email Sent!</AlertTitle>
          <AlertDescription>
            Please check your inbox or spam folder. If you don't see the email, check the logs in 
            Supabase Edge Functions for more details.
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
              Send a standard test email to verify your email configuration is working.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter recipient email (optional)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="max-w-md"
              />
              <Button 
                onClick={sendTestEmail}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Leave the recipient field empty to send to your configured sender email.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="password-reset" className="mt-4">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-700">
              Test the password reset email flow specifically. This will attempt to send a real password reset email.
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
                disabled={sending || !recipient}
                variant="secondary"
              >
                {sending ? 'Sending...' : 'Test Password Reset'}
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              This will test both Supabase's built-in email and the edge function fallback.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-gray-500 pt-4 border-t mt-4">
        If emails are bouncing, verify your domain in Resend and update the SENDER_EMAIL secret.
        For Gmail SMTP issues, create an app password in your Google account security settings.
      </p>
    </div>
  );
}
