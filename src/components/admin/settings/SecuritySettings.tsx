import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Clock } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings";
import { SecuritySettings as SecuritySettingsType } from "@/contexts/site-settings/types";

const securityFormSchema = z.object({
  sessionTimeout: z.coerce.number().min(15, {
    message: "Session timeout must be at least 15 minutes.",
  }).max(1440, {
    message: "Session timeout cannot exceed 24 hours (1440 minutes)."
  }),
  requirePasswordReset: z.boolean().default(false),
  passwordResetDays: z.coerce.number().min(30).max(365).optional(),
  twoFactorAuth: z.boolean().default(false),
  strongPasswords: z.boolean().default(true),
});

type SecurityFormValues = z.infer<typeof securityFormSchema>;

export const SecuritySettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading } = useSiteSettings();

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: settings.security as SecuritySettingsType,
  });

  useEffect(() => {
    console.log("SecuritySettings received settings:", settings.security);
    if (!isLoading) {
      form.reset(settings.security as SecuritySettingsType);
    }
  }, [isLoading, settings.security, form]);

  const watchRequirePasswordReset = form.watch("requirePasswordReset");

  const onSubmit = async (data: SecurityFormValues) => {
    console.log("Submitting Security Settings:", data);
    await updateSettings('security', data);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sessionTimeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Timeout (minutes)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={15} max={1440} />
                    </FormControl>
                    <FormDescription>
                      Users will be automatically logged out after this period of inactivity.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="strongPasswords"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Strong Passwords</FormLabel>
                        <FormDescription>
                          Require passwords with at least 8 characters, including uppercase, lowercase, numbers, and special characters.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twoFactorAuth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Two-Factor Authentication</FormLabel>
                        <FormDescription>
                          Require users to verify their identity using a secondary authentication method.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirePasswordReset"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require Periodic Password Reset</FormLabel>
                        <FormDescription>
                          Force users to change their passwords periodically.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchRequirePasswordReset && (
                  <FormField
                    control={form.control}
                    name="passwordResetDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Reset Interval (days)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={30} max={365} />
                        </FormControl>
                        <FormDescription>
                          Users will be required to change their password after this many days.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Security Settings</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
