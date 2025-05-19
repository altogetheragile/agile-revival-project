
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateRangeFieldsProps<T extends { startDate?: Date | string | null; endDate?: Date | string | null; }> {
  form: UseFormReturn<T>;
  className?: string;
  startFieldLabel?: string;
  endFieldLabel?: string;
  required?: boolean;
}

export function DateRangeFields<T extends { startDate?: Date | string | null; endDate?: Date | string | null; }>({
  form,
  className,
  startFieldLabel = "Start Date",
  endFieldLabel = "End Date",
  required = false
}: DateRangeFieldsProps<T>) {
  // Helper to parse dates which could be strings or Date objects
  const parseDate = (date: Date | string | undefined | null): Date | undefined => {
    if (!date) return undefined;
    if (date instanceof Date) return date;
    try {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    } catch (e) {
      return undefined;
    }
  };

  const startDate = parseDate(form.watch('startDate' as any));
  const endDate = parseDate(form.watch('endDate' as any));

  // Update end date if start date is changed to be later
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      form.setValue('endDate' as any, startDate);
    }
  }, [startDate, endDate, form]);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <FormField
        control={form.control}
        name={'startDate' as any}
        rules={{ required: required ? "Start date is required" : false }}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{startFieldLabel}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    // If end date is not set or is before start date, set it to start date
                    const endDate = parseDate(form.watch('endDate' as any));
                    if (!endDate || (date && endDate < date)) {
                      form.setValue('endDate' as any, date);
                    }
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={'endDate' as any}
        rules={{ required: required ? "End date is required" : false }}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{endFieldLabel}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  disabled={(date) => 
                    date < new Date("1900-01-01") || 
                    (startDate ? date < startDate : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
