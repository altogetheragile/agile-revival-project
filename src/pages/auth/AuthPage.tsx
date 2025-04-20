
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>This application no longer requires authentication.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Authentication has been removed from this application.</p>
          <p className="mt-4">You can access all features without logging in.</p>
        </CardContent>
      </Card>
    </div>
  );
}
