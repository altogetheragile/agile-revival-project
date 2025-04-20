
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GeneralSettings } from "@/contexts/site-settings/types";

interface ContactInformationSectionProps {
  form: UseFormReturn<GeneralSettings>;
}

export const ContactInformationSection = ({ form }: ContactInformationSectionProps) => {
  return (
    <Card className="border-dashed">
      <CardHeader className="p-4">
        <CardTitle className="text-sm flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          <span>Contact Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Email
                </FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Phone
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="location.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sm">Social Media Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="socialMedia.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://twitter.com/..." />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialMedia.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://linkedin.com/in/..." />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialMedia.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://facebook.com/..." />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="socialMedia.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://instagram.com/..." />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
