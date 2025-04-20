
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GeneralFormValues } from "./schema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface SiteInformationSectionProps {
  form: UseFormReturn<GeneralFormValues>;
}

export const SiteInformationSection = ({ form }: SiteInformationSectionProps) => {
  // State to show/hide dropdown content
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-5 w-5" />
          <span>Site Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Location</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="location.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Social Media selection dropdown */}
          <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center px-4 py-2 bg-agile-purple rounded text-white hover:bg-agile-purple-dark transition-all focus:outline-none"
                >
                  Social Media Links
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[320px] max-w-lg z-50 bg-white text-gray-900 mt-2 p-4 rounded shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="socialMedia.linkedin"
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
                    name="socialMedia.twitter"
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
                    name="socialMedia.facebook"
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
                    name="socialMedia.instagram"
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
                    name="socialMedia.tiktok"
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
                    name="socialMedia.bluesky"
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

