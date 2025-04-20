import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building, Globe } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings";
import { GeneralSettings as GeneralSettingsType } from "@/contexts/site-settings/types";

const generalFormSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({ message: "Please enter a valid email address." }),
  contactPhone: z.string().optional(),
  defaultLanguage: z.string(),
  timezone: z.string(),
  currency: z.string(),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

export const GeneralSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading } = useSiteSettings();
  
  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "America/Hawaii", label: "Hawaii Time (HT)" },
    { value: "Pacific/Honolulu", label: "Hawaii-Aleutian Time (HAT)" },
    { value: "America/Phoenix", label: "Arizona (MST)" },
    { value: "Europe/London", label: "British Time (GMT/BST)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Europe/Athens", label: "Eastern European Time (EET)" },
    { value: "Europe/Moscow", label: "Moscow Time (MSK)" },
    { value: "Asia/Dubai", label: "Gulf Time (GT)" },
    { value: "Asia/Shanghai", label: "China Time (CST)" },
    { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
    { value: "Asia/Tokyo", label: "Japan Time (JST)" },
    { value: "Asia/Seoul", label: "Korea Time (KST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
    { value: "Australia/Perth", label: "Australian Western Time (AWT)" },
    { value: "Pacific/Auckland", label: "New Zealand Time (NZT)" },
  ];

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
  ];

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: settings.general as GeneralSettingsType,
  });

  useEffect(() => {
    console.log("GeneralSettings received settings:", settings.general);
    if (!isLoading) {
      form.reset(settings.general as GeneralSettingsType);
    }
  }, [isLoading, settings.general, form]);

  const onSubmit = async (data: GeneralFormValues) => {
    console.log("Submitting General Settings:", data);
    await updateSettings('general', data);
    
    console.log("After update - contactEmail:", data.contactEmail);
    console.log("After update - contactPhone:", data.contactPhone);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            <span>General Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed across the platform.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Card className="border-dashed">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Localization Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save General Settings</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
