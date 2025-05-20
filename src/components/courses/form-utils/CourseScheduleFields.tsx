
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface CourseScheduleFieldsProps {
  form: UseFormReturn<CourseFormData>;
  isTemplate?: boolean;
}

export const CourseScheduleFields = ({ 
  form,
  isTemplate = false
}: CourseScheduleFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schedule & Location</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        isTemplate && "bg-muted cursor-not-allowed"
                      )}
                      disabled={isTemplate}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : isTemplate ? (
                        "Not applicable for template"
                      ) : (
                        "Pick a date"
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                {!isTemplate && (
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
              <FormDescription>
                {isTemplate ? "Will be set when scheduling" : "When does the event start?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        isTemplate && "bg-muted cursor-not-allowed"
                      )}
                      disabled={isTemplate}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : isTemplate ? (
                        "Not applicable for template"
                      ) : (
                        "Pick a date"
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                {!isTemplate && (
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues("startDate");
                        return startDate && date < new Date(startDate);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
              <FormDescription>
                {isTemplate ? "Will be set when scheduling" : "When does the event end?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder={isTemplate ? "To Be Determined" : "Enter location"} 
                  {...field}
                  readOnly={isTemplate}
                  className={isTemplate ? "bg-muted" : ""}
                />
              </FormControl>
              <FormDescription>
                {isTemplate ? "Will be specified when scheduling" : "Where will the event be held?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input 
                  placeholder={isTemplate ? "To Be Assigned" : "Enter instructor name"} 
                  {...field}
                  readOnly={isTemplate}
                  className={isTemplate ? "bg-muted" : ""}
                />
              </FormControl>
              <FormDescription>
                {isTemplate ? "Will be assigned when scheduling" : "Who will be teaching this event?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="spotsAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Spots</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  readOnly={isTemplate}
                  className={isTemplate ? "bg-muted" : ""}
                  min={0}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormDescription>
                {isTemplate ? "Will be set when scheduling" : "How many spots are available?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="£999" {...field} />
              </FormControl>
              <FormDescription>
                How much does the event cost?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
