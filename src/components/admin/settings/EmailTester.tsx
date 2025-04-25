
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
import { Info } from "lucide-react";

export function EmailTester() {
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [showEmailInfo, setShowEmailInfo] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
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

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Test Email Configuration</h3>
      
      {lastError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Email Error</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{lastError}</p>
            <p className="text-sm">
              Common solutions:
              <ul className="list-disc pl-5 mt-1">
                <li>Verify your domain in Resend.com</li>
                <li>Make sure your SENDER_EMAIL secret matches a verified domain</li>
                <li>Check if the recipient email address exists</li>
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
        If emails are bouncing, verify your domain in Resend and update the SENDER_EMAIL secret.
      </p>
    </div>
  );
}
