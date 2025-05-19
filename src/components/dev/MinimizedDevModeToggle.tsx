
import { Button } from '@/components/ui/button';
import { ShieldAlert, Shield } from 'lucide-react';

interface MinimizedDevModeToggleProps {
  devMode: boolean;
  onMaximize: () => void;
}

export const MinimizedDevModeToggle = ({
  devMode,
  onMaximize
}: MinimizedDevModeToggleProps) => {
  return (
    <Button
      onClick={onMaximize}
      className="fixed bottom-4 left-4 z-50 h-8 w-8 rounded-full p-0"
      variant={devMode ? "destructive" : "secondary"}
      size="icon"
      title="Show Dev Mode toggle"
    >
      {devMode ? <ShieldAlert size={16} /> : <Shield size={16} />}
    </Button>
  );
};
