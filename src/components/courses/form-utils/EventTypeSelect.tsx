
import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface EventType {
  value: string;
  label: string;
}

interface EventTypeSelectProps {
  eventTypes?: EventType[];
  value: string;
  onValueChange: (value: string) => void;
  onChange?: (value: string) => void;
  onDelete?: (value: string, e: React.MouseEvent) => void;
}

export const EventTypeSelect: React.FC<EventTypeSelectProps> = ({
  eventTypes = [], 
  value, 
  onValueChange, 
  onChange, 
  onDelete
}) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Select
      onValueChange={handleChange}
      value={value}
      defaultValue={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select or create an event type" />
      </SelectTrigger>
      <SelectContent className="min-w-[200px] z-[100]">
        {eventTypes.map(type => (
          <div
            key={type.value}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer group relative"
          >
            <SelectItem
              value={type.value}
              className="flex-1 cursor-pointer"
            >
              {type.label}
            </SelectItem>
            {onDelete && (
              <button
                type="button"
                className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600"
                onClick={e => {
                  e.preventDefault(); e.stopPropagation();
                  onDelete(type.value, e);
                }}
                aria-label={`Delete event type ${type.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        <SelectItem
          key="add-event-type"
          value="__add_event_type__"
          className="text-blue-600 cursor-pointer border-t border-muted"
        >
          + Add new event type
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
