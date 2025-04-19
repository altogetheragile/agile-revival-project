
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";

interface ResetPasswordActionsProps {
  isLoading: boolean;
  onCancel: () => void;
  buttonText: string;
}

export function ResetPasswordActions({ 
  isLoading, 
  onCancel, 
  buttonText 
}: ResetPasswordActionsProps) {
  if (isLoading) {
    return (
      <div className="flex space-x-2">
        <Button 
          type="button" 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          onClick={onCancel}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button 
          type="button" 
          className="w-full"
          disabled={true}
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {buttonText}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      type="submit" 
      className="w-full bg-green-600 hover:bg-green-700 transition-colors"
    >
      {buttonText}
    </Button>
  );
}
