
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { generalFormSchema, GeneralFormValues } from "./general/schema";
import { SiteInformationSection } from "./general/SiteInformationSection";
import { LocalizationSection } from "./general/LocalizationSection";

export const GeneralSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading, refreshSettings } = useSiteSettings();

  // Log the current settings to assist with debugging
  console.log("GeneralSettings component - current settings:", settings.general);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: settings.general?.siteName || "",
      contactEmail: settings.general?.contactEmail || "",
      contactPhone: settings.general?.contactPhone || "",
      defaultLanguage: settings.general?.defaultLanguage || "en",
      timezone: settings.general?.timezone || "UTC",
      currency: settings.general?.currency || "USD",
      location: settings.general?.location || {
        address: "",
        city: "",
        country: "",
      },
      socialMedia: settings.general?.socialMedia || {
        twitter: "",
        linkedin: "",
        facebook: "",
        instagram: "",
      },
    },
  });

  useEffect(() => {
    if (!isLoading && settings.general) {
      // Create safe objects with default values for nested properties
      const location = settings.general.location || { address: "", city: "", country: "" };
      const socialMedia = settings.general.socialMedia || { twitter: "", linkedin: "", facebook: "", instagram: "" };
      
      console.log("Resetting form with values:", {
        siteName: settings.general.siteName || "",
        contactEmail: settings.general.contactEmail || "",
        defaultLanguage: settings.general.defaultLanguage || "",
      });
      
      form.reset({
        siteName: settings.general.siteName || "",
        contactEmail: settings.general.contactEmail || "",
        contactPhone: settings.general.contactPhone || "",
        defaultLanguage: settings.general.defaultLanguage || "en",
        timezone: settings.general.timezone || "UTC",
        currency: settings.general.currency || "USD",
        location,
        socialMedia,
      });
    }
  }, [isLoading, settings.general, form]);

  const onSubmit = async (data: GeneralFormValues) => {
    try {
      console.log("Submitting General Settings:", data);
      await updateSettings('general', data);
      await refreshSettings();
      
      toast({
        title: "Settings updated",
        description: "General settings have been saved and will be reflected across the site.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug display - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="p-2 bg-slate-100 rounded text-xs overflow-auto max-h-32 mb-4">
          <p className="font-medium">Current settings data:</p>
          <pre>{JSON.stringify(settings.general, null, 2)}</pre>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SiteInformationSection form={form} />
          <LocalizationSection form={form} />
          
          <div className="flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Save size={16} />
              Save General Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
