
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { InterfaceFormValues } from "./schema";

interface LayoutSettingsProps {
  form: UseFormReturn<InterfaceFormValues>;
}

export const LayoutSettings = ({ form }: LayoutSettingsProps) => {
  return (
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
  );
};
