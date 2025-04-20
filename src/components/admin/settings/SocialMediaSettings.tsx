
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useSiteSettings } from "@/contexts/site-settings";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { socialMediaSchema } from "./general/schema";
import { useToast } from "@/hooks/use-toast";

type SocialMediaFormValues = {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  bluesky?: string;
};

export const SocialMediaSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading, refreshSettings } = useSiteSettings();

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      bluesky: "",
    },
  });

  useEffect(() => {
    if (!isLoading && settings.general && settings.general.socialMedia) {
      form.reset({
        twitter: settings.general.socialMedia.twitter || "",
        linkedin: settings.general.socialMedia.linkedin || "",
        facebook: settings.general.socialMedia.facebook || "",
        instagram: settings.general.socialMedia.instagram || "",
        tiktok: settings.general.socialMedia.tiktok || "",
        bluesky: settings.general.socialMedia.bluesky || "",
      });
    }
  }, [isLoading, settings.general, form]);

  const onSubmit = async (data: SocialMediaFormValues) => {
    try {
      await updateSettings("general", {
        ...settings.general,
        socialMedia: data,
      });
      await refreshSettings();
      toast({
        title: "Social Media Settings updated",
        description: "Social media links have been saved.",
      });
    } catch (error) {
      console.error("Error saving social media settings", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://linkedin.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://twitter.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://facebook.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://instagram.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://tiktok.com/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bluesky"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bluesky URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://bsky.app/profile/..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save size={16} />
                Save Social Media
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
