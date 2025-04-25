
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function EmailTester() {
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState('');
  const { toast } = useToast();

  const sendTestEmail = async () => {
    try {
      setSending(true);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'test',
          recipient: recipient || undefined
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Test email sent",
        description: "Please check your inbox",
      });
      
      console.log('Email send result:', data);
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Test Email Configuration</h3>
      <div className="flex gap-4">
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
  );
}
