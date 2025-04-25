
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface ResetPasswordSuccessProps {
  onSwitchToLogin: () => void;
}

export function ResetPasswordSuccess({ onSwitchToLogin }: ResetPasswordSuccessProps) {
  return (
    <Alert className="bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-700">
        If an account exists with this email, you'll receive password reset instructions shortly.
        <p className="mt-2">Please check your email inbox and spam folders.</p>
        <p className="mt-2 text-sm">
          Note: If you don't receive the email within a few minutes:
          <ul className="list-disc pl-5 mt-1">
            <li>Check your spam/junk folder</li>
            <li>Verify you used the correct email address</li>
            <li>Try again in a few moments if necessary</li>
          </ul>
        </p>
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSwitchToLogin}
            className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
          >
            Back to Sign In
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
