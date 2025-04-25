
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';

export function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-agile-purple/10">
              <Loader2 className="h-6 w-6 text-agile-purple animate-spin" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Verifying Reset Link</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your password reset link...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
