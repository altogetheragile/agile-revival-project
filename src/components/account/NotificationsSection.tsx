
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface NotificationPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  courseUpdates: boolean;
}

export function NotificationsSection() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    courseUpdates: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // In a real application, you would fetch the user's notification preferences
    // from the database. For now, we'll use dummy data.
    setTimeout(() => {
      setPreferences({
        emailNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        courseUpdates: true,
      });
      setLoading(false);
    }, 500);
  }, []);
  
  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };
  
  const handleSavePreferences = () => {
    setSaving(true);
    
    // Simulate saving to database
    setTimeout(() => {
      toast.success("Notification preferences saved");
      setSaving(false);
    }, 1000);
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
      <div className="space-y-4">
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <Label htmlFor="email-notifications" className="font-medium">
              Email notifications
            </Label>
            <p className="text-sm text-gray-500">
              Receive emails about your account activity and updates
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={preferences.emailNotifications}
            onCheckedChange={() => handleToggle('emailNotifications')}
          />
        </div>
        
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <Label htmlFor="marketing-emails" className="font-medium">
              Marketing emails
            </Label>
            <p className="text-sm text-gray-500">
              Receive emails about new features, products and services
            </p>
          </div>
          <Switch
            id="marketing-emails"
            checked={preferences.marketingEmails}
            onCheckedChange={() => handleToggle('marketingEmails')}
          />
        </div>
        
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <Label htmlFor="security-alerts" className="font-medium">
              Security alerts
            </Label>
            <p className="text-sm text-gray-500">
              Get notified about important security-related events
            </p>
          </div>
          <Switch
            id="security-alerts"
            checked={preferences.securityAlerts}
            onCheckedChange={() => handleToggle('securityAlerts')}
          />
        </div>
        
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div>
            <Label htmlFor="course-updates" className="font-medium">
              Course updates
            </Label>
            <p className="text-sm text-gray-500">
              Receive notifications about changes to courses you're registered for
            </p>
          </div>
          <Switch
            id="course-updates"
            checked={preferences.courseUpdates}
            onCheckedChange={() => handleToggle('courseUpdates')}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePreferences}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Preferences'
          )}
        </Button>
      </div>
    </div>
  );
}
