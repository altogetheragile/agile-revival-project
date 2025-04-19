
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
import { LayoutDashboard, Navigation, Image } from "lucide-react";
import { useSiteSettings, InterfaceSettings as InterfaceSettingsType } from "@/contexts/SiteSettingsContext";

const interfaceFormSchema = z.object({
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  homepageLayout: z.string(),
  navigationStyle: z.string(),
});

type InterfaceFormValues = z.infer<typeof interfaceFormSchema>;

export const InterfaceSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading } = useSiteSettings();

  const form = useForm<InterfaceFormValues>({
    resolver: zodResolver(interfaceFormSchema),
    defaultValues: settings.interface as InterfaceSettingsType,
  });

  // When settings load or change, update form values
  useEffect(() => {
    console.log("InterfaceSettings received settings:", settings.interface);
    if (!isLoading) {
      form.reset(settings.interface as InterfaceSettingsType);
    }
  }, [isLoading, settings.interface, form]);

  const onSubmit = async (data: InterfaceFormValues) => {
    console.log("Submitting Interface Settings:", data);
    await updateSettings('interface', data);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Image className="mr-2 h-5 w-5" />
            <span>Branding</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/logo.png" />
                      </FormControl>
                      <FormDescription>
                        Enter the URL for your site logo (recommended size: 200x50px)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faviconUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/favicon.png" />
                      </FormControl>
                      <FormDescription>
                        Enter the URL for your site favicon (must be PNG, size: 32x32px)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <Input 
                          type="color" 
                          value={field.value} 
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-12 p-1 h-10"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <Input 
                          type="color" 
                          value={field.value} 
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-12 p-1 h-10"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Card className="border-dashed">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Layout Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="homepageLayout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Homepage Layout</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select layout" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard Layout</SelectItem>
                            <SelectItem value="featured">Featured Content First</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="full-width">Full Width</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="navigationStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Navigation Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select navigation style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="expanded">Expanded</SelectItem>
                            <SelectItem value="sidebar">Sidebar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit">Save Interface Settings</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
