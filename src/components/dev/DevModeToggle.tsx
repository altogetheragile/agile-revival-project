
import { useDevMode } from '@/contexts/DevModeContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';
import { useState } from 'react';

const DevModeToggle = () => {
  const { devMode, toggleDevMode } = useDevMode();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`bg-white border rounded-lg shadow-lg p-4 w-64 transition-all duration-200 ${
        devMode ? 'border-red-500 shadow-red-100' : ''
      }`}>
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
        
        {devMode && !expanded && (
          <button 
            onClick={() => setExpanded(true)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Show more info
          </button>
        )}
        
        {devMode && expanded && (
          <div className="mt-2 text-xs border-t pt-2">
            <p className="font-semibold text-red-600">Dev Mode active!</p>
            <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-700">
              <li>All auth checks are bypassed</li>
              <li>Admin access is granted to all routes</li>
              <li>Database RLS policies are ignored</li>
              <li>This state persists across page refreshes</li>
            </ul>
            <button 
              onClick={() => setExpanded(false)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              Hide info
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevModeToggle;
