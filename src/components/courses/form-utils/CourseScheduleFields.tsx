import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay, parse } from "date-fns";
import { cn } from "@/lib/utils";

interface CourseScheduleFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

const DATE_FORMAT = "PPP";

export const CourseScheduleFields: React.FC<CourseScheduleFieldsProps> = ({ form }) => {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  const getSelectedDates = () => {
    const value = (form.getValues("dates") || "");
    return value
      .split(",")
      .map(str => str.trim())
      .filter(str => str.length > 0)
      .map(str => {
        const d = parse(str, DATE_FORMAT, new Date());
        if (isNaN(d.getTime())) return null;
        return d;
      })
      .filter(Boolean) as Date[];
  };

  const setDates = (dates: Date[]) => {
    const uniques = dates
      .map(date => format(date, DATE_FORMAT))
      .filter((item, idx, arr) => arr.indexOf(item) === idx);
    form.setValue("dates", uniques.join(", "));
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    setCalendarDate(date);

    if (!date) return;

    const currentDates = getSelectedDates();
    const index = currentDates.findIndex(d => isSameDay(d, date));

    let newDates: Date[];
    if (index === -1) {
      newDates = [...currentDates, date];
    } else {
      newDates = [...currentDates.slice(0, index), ...currentDates.slice(index + 1)];
    }
    setDates(newDates);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="dates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dates</FormLabel>
            <div className="flex gap-2 items-center">
              <FormControl>
                <Input
                  placeholder="e.g. May 15-16, 2025"
                  {...field}
                  className="flex-1"
                  onChange={e => {
                    field.onChange(e);
                    setCalendarDate(undefined);
                  }}
                />
              </FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center justify-center rounded-md border border-input bg-background px-2 py-2 text-sm font-medium hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "h-10 w-10"
                    )}
                    aria-label="Pick date"
                  >
                    <CalendarIcon className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={undefined}
                    onSelect={handleCalendarSelect}
                    modifiers={{
                      selected: getSelectedDates()
                    }}
                    className={cn("p-3 pointer-events-auto")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormDescription>
              When will this course take place? For multiple dates, separate with commas.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="e.g. San Francisco, CA" {...field} />
            </FormControl>
            <FormDescription>
              Physical location or "Online" for virtual courses
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
