
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

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "",
      contactEmail: "",
      contactPhone: "",
      defaultLanguage: "en",
      timezone: "UTC",
      currency: "USD",
      location: {
        address: "",
        city: "",
        country: "",
      },
      socialMedia: {
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
      const location = settings.general.location || {};
      const socialMedia = settings.general.socialMedia || {};
      
      form.reset({
        siteName: settings.general.siteName || "",
        contactEmail: settings.general.contactEmail || "",
        contactPhone: settings.general.contactPhone || "",
        defaultLanguage: settings.general.defaultLanguage || "en",
        timezone: settings.general.timezone || "UTC",
        currency: settings.general.currency || "USD",
        location: {
          address: location.address || "",
          city: location.city || "",
          country: location.country || "",
        },
        socialMedia: {
          twitter: socialMedia.twitter || "",
          linkedin: socialMedia.linkedin || "",
          facebook: socialMedia.facebook || "",
          instagram: socialMedia.instagram || "",
        },
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
