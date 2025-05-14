
import React from 'react';
import { Button } from "@/components/ui/button";
import { useSiteSettings } from '@/contexts/site-settings';
import { defaultSettings } from '@/contexts/site-settings/defaultSettings';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, RotateCcw, Save } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SettingsHeader = () => {
  const { settings, updateSettings, refreshSettings } = useSiteSettings();
  const { toast } = useToast();

  const handleResetAll = async () => {
    try {
      // Reset each settings category
      await Promise.all([
        updateSettings('general', defaultSettings.general),
        updateSettings('interface', defaultSettings.interface),
        updateSettings('users', defaultSettings.users),
        updateSettings('security', defaultSettings.security)
      ]);
      
      await refreshSettings();
      
      toast({
        title: "Settings Reset",
        description: "All settings have been restored to their default values",
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset settings to defaults",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all settings to their default values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetAll} className="bg-destructive">
                Reset All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
