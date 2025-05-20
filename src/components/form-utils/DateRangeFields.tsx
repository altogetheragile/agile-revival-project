
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { UseFormReturn, Path, FieldValues, PathValue } from "react-hook-form";
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
import { cn } from "@/lib/utils";

// Define a generic type for form data
interface DateRangeFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  className?: string;
  startFieldLabel?: string;
  endFieldLabel?: string;
  startField: Path<T>;
  endField: Path<T>;
  required?: boolean;
}

export function DateRangeFields<T extends FieldValues>({
  form,
  className,
  startFieldLabel = "Start Date",
  endFieldLabel = "End Date",
  startField,
  endField,
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

  // Get start and end dates from the form using the provided field names
  const startDateValue = form.watch(startField);
  const endDateValue = form.watch(endField);
  
  const startDate = parseDate(startDateValue as string | Date);
  const endDate = parseDate(endDateValue as string | Date);

  // Update end date if start date is changed to be later
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      form.setValue(endField, startDate as PathValue<T, Path<T>>, {
        shouldValidate: true
      });
    }
  }, [startDate, endDate, form, endField]);

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <FormField
        control={form.control}
        name={startField}
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
                      format(new Date(field.value as string | Date), "PPP")
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
                  selected={field.value ? new Date(field.value as string | Date) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    // If end date is not set or is before start date, set it to start date
                    const endDate = parseDate(form.watch(endField) as string | Date);
                    if (!endDate || (date && endDate < date)) {
                      form.setValue(endField, date as PathValue<T, Path<T>>, {
                        shouldValidate: true
                      });
                    }
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={endField}
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
                      format(new Date(field.value as string | Date), "PPP")
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
                  selected={field.value ? new Date(field.value as string | Date) : undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                  }}
                  disabled={(date) => 
                    date < new Date("1900-01-01") || 
                    (startDate ? date < startDate : false)
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
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
