
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityPreferences {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
}

export function SecuritySection() {
  const [preferences, setPreferences] = useState<SecurityPreferences>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    // In a real application, you would fetch the user's security preferences
    // from the database. For now, we'll use dummy data.
    setTimeout(() => {
      setPreferences({
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginNotifications: true,
      });
      setLoading(false);
    }, 500);
  }, []);
  
  const handleToggle2FA = async () => {
    setUpdating(true);
    
    // This is where you would implement the 2FA setup flow
    // For now, we'll just toggle the state and show a message
    
    try {
      setTimeout(() => {
        if (!preferences.twoFactorEnabled) {
          toast.info("Two-factor authentication", {
            description: "This feature is not yet implemented. Coming soon!",
          });
        } else {
          setPreferences({
            ...preferences,
            twoFactorEnabled: false,
          });
          toast.success("Two-factor authentication disabled");
        }
        setUpdating(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to update two-factor authentication");
      setUpdating(false);
    }
  };
  
  const handleLogoutAllDevices = async () => {
    setUpdating(true);
    
    try {
      // Sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      toast.success("Signed out from all devices");
      
      // Sign out current session and redirect to login
      setTimeout(() => {
        signOut();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error signing out from all devices:', error);
      toast.error("Failed to sign out from all devices", {
        description: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-agile-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4 mr-2" />
        <AlertDescription>
          Some security features are currently in development and will be available soon.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <Label htmlFor="two-factor" className="font-medium">
              Two-factor authentication
            </Label>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            id="two-factor"
            checked={preferences.twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={updating}
          />
        </div>
        
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <Label htmlFor="login-notify" className="font-medium">
              Login notifications
            </Label>
            <p className="text-sm text-gray-500">
              Receive alerts about new sign-ins to your account
            </p>
          </div>
          <Switch
            id="login-notify"
            checked={preferences.loginNotifications}
            onCheckedChange={() => {
              setPreferences({
                ...preferences,
                loginNotifications: !preferences.loginNotifications,
              });
              toast.success("Preference updated");
            }}
          />
        </div>
      </div>
      
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="font-medium">Active Sessions</h3>
        <p className="text-sm text-gray-500">
          Sign out from all devices where you're currently logged in.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleLogoutAllDevices}
          disabled={updating}
          className="flex items-center gap-2"
        >
          {updating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Sign out from all devices
        </Button>
      </div>
    </div>
  );
}
