
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InterfaceFormValues } from "./schema";

interface ColorSettingsProps {
  form: UseFormReturn<InterfaceFormValues>;
}

export const ColorSettings = ({ form }: ColorSettingsProps) => {
  return (
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
                value={field.value || ""} 
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
                value={field.value || ""} 
                onChange={(e) => field.onChange(e.target.value)}
                className="w-12 p-1 h-10"
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
