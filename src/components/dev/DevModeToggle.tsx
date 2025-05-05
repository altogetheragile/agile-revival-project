
import { useDevMode } from '@/contexts/DevModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';

const DevModeToggle = () => {
  const { devMode, toggleDevMode } = useDevMode();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white border rounded-lg shadow-lg p-4 w-64">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className={devMode ? "text-red-500" : "text-green-500"} size={18} />
            <Label htmlFor="dev-mode" className="font-medium">Development Mode</Label>
          </div>
          <Switch
            id="dev-mode"
            checked={devMode}
            onCheckedChange={toggleDevMode}
          />
        </div>
        
        {devMode && (
          <Alert variant="destructive" className="mt-2 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Security is disabled! All authentication and authorization checks are bypassed.
            </AlertDescription>
          </Alert>
        )}
        
        {!devMode && (
          <p className="text-xs text-gray-500 mt-1">
            Toggle to bypass authentication & authorization checks for development
          </p>
        )}
      </div>
    </div>
  );
};

export default DevModeToggle;
