
import { ShieldAlert, Shield, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface DevModeToggleHeaderProps {
  devMode: boolean;
  onToggle: () => void;
  onMinimize: () => void;
}

export const DevModeToggleHeader = ({ 
  devMode, 
  onToggle, 
  onMinimize 
}: DevModeToggleHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {devMode ? (
          <ShieldAlert className="text-red-500" size={18} />
        ) : (
          <Shield className="text-green-500" size={18} />
        )}
        <Label htmlFor="dev-mode" className="font-medium">
          Development Mode
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="dev-mode"
          checked={devMode}
          onCheckedChange={onToggle}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full" 
          onClick={onMinimize}
        >
          <X size={14} />
        </Button>
      </div>
    </div>
  );
};
