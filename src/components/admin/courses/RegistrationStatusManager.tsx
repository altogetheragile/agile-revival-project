
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationStatusManagerProps {
  registrationId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

export const RegistrationStatusManager = ({
  registrationId,
  currentStatus,
  onStatusChange,
}: RegistrationStatusManagerProps) => {
  const { toast } = useToast();

  const updateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('course_registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Registration status changed to ${newStatus}`,
      });
      
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => updateStatus('confirmed')}
          disabled={currentStatus === 'confirmed'}
        >
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          Confirm Registration
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => updateStatus('pending')}
          disabled={currentStatus === 'pending'}
        >
          <Clock className="mr-2 h-4 w-4 text-amber-600" />
          Mark as Pending
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => updateStatus('cancelled')}
          disabled={currentStatus === 'cancelled'}
          className="text-red-600"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Registration
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
