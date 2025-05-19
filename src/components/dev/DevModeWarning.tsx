
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DevModeWarningProps {
  expanded: boolean;
  devMode: boolean;
  onToggleExpand: () => void;
  onDisable: () => void;
}

export const DevModeWarning = ({
  expanded,
  devMode,
  onToggleExpand,
  onDisable
}: DevModeWarningProps) => {
  if (!devMode) {
    return (
      <p className="text-xs text-gray-500 mt-1">
        Toggle to bypass authentication & authorization checks for development
      </p>
    );
  }

  if (!expanded) {
    return (
      <button 
        onClick={onToggleExpand}
        className="text-xs text-blue-600 hover:text-blue-800 mt-2"
      >
        Show more info
      </button>
    );
  }

  return (
    <div>
      <Alert variant="destructive" className="mt-2 py-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Security is disabled! All authentication and authorization checks are bypassed.
        </AlertDescription>
      </Alert>
      
      <div className="mt-2 text-xs border-t pt-2">
        <p className="font-semibold text-red-600">Dev Mode active!</p>
        <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-700">
          <li>All auth checks are bypassed</li>
          <li>Admin access is granted to all routes</li>
          <li>Database RLS policies are ignored</li>
          <li>This state persists across page refreshes</li>
          <li>Changes are saved locally in browser storage</li>
        </ul>
        <div className="flex justify-between mt-2">
          <button 
            onClick={onToggleExpand}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Hide info
          </button>
          <button
            onClick={onDisable}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Disable Dev Mode
          </button>
        </div>
      </div>
    </div>
  );
};
