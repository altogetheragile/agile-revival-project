
import React, { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import { InterfaceSettings as InterfaceSettingsType } from "@/contexts/site-settings/types";
import { BrandingSection } from "./interface/BrandingSection";
import { ColorSettings } from "./interface/ColorSettings";
import { LayoutSettings } from "./interface/LayoutSettings";
import { interfaceFormSchema, type InterfaceFormValues } from "./interface/schema";

export const InterfaceSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading } = useSiteSettings();

  const form = useForm<InterfaceFormValues>({
    resolver: zodResolver(interfaceFormSchema),
    defaultValues: settings.interface as InterfaceSettingsType,
  });

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BrandingSection form={form} />
          <ColorSettings form={form} />
          <LayoutSettings form={form} />
          
          <div className="flex justify-end">
            <Button type="submit">Save Interface Settings</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
