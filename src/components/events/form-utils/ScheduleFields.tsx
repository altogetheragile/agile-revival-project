
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/types/event";

interface ScheduleFieldsProps {
  form: UseFormReturn<EventFormData>;
}

export const ScheduleFields: React.FC<ScheduleFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schedule Information</h3>
      
      <FormField
        control={form.control}
        name="dates"
        rules={{ required: "Dates are required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dates</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., June 10-12, 2023" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., 2 days, 6 hours" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        rules={{ required: "Location is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., London or Online via Zoom" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
