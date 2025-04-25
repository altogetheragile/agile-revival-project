
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ResetPasswordActionsProps {
  isLoading: boolean;
  buttonText: string;
}

export function ResetPasswordActions({ isLoading, buttonText }: ResetPasswordActionsProps) {
  return (
    <Button 
      type="submit" 
      className="w-full bg-green-600 hover:bg-green-700"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {buttonText}
        </>
      ) : buttonText}
    </Button>
  );
}
