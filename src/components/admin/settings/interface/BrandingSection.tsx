
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { InterfaceFormValues } from "./schema";
import ImageUploadInput from "@/components/images/ImageUploadInput";
import React from "react";

interface BrandingSectionProps {
  form: UseFormReturn<InterfaceFormValues>;
}

export const BrandingSection = ({ form }: BrandingSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="mr-2 h-5 w-5" />
          <span>Branding</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                <div className="mt-2">
                  <ImageUploadInput
                    label="Upload Logo"
                    onUpload={(url) => form.setValue("logoUrl", url, { shouldValidate: true })}
                  />
                </div>
                <FormDescription>
                  Enter or upload your site logo (recommended size: 200x50px)
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
                <div className="mt-2">
                  <ImageUploadInput
                    label="Upload Favicon"
                    onUpload={(url) => form.setValue("faviconUrl", url, { shouldValidate: true })}
                  />
                </div>
                <FormDescription>
                  Enter or upload your site favicon (must be PNG, size: 32x32px)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
