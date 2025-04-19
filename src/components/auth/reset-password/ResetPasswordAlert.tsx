
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ResetPasswordAlertProps {
  error?: string | null;
  retryCount: number;
  onRetry?: () => void;
  success?: boolean;
  onSwitchToLogin: () => void;
}

export function ResetPasswordAlert({ 
  error, 
  retryCount, 
  onRetry, 
  success, 
  onSwitchToLogin 
}: ResetPasswordAlertProps) {
  if (success) {
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          {retryCount > 0 && (
            <p className="mt-2 text-sm">
              Tips to resolve:
              <ul className="list-disc pl-5 mt-1">
                <li>Wait a few moments and try again</li>
                <li>Check your internet connection</li>
                <li>If the issue persists, please contact support</li>
              </ul>
            </p>
          )}
          {(error.includes('timeout') || error.includes('busy')) && onRetry && (
            <Button 
              type="button" 
              onClick={onRetry} 
              className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
              size="sm"
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
