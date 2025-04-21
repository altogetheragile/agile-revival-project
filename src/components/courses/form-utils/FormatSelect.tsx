
import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Format {
  value: string;
  label: string;
}

interface FormatSelectProps {
  formats: Format[];
  value: string;
  onValueChange: (value: string) => void;
  onDelete: (value: string, e: React.MouseEvent) => void;
}

export const FormatSelect: React.FC<FormatSelectProps> = ({
  formats,
  value,
  onValueChange,
  onDelete
}) => {
  return (
    <Select
      onValueChange={onValueChange}
      value={value}
      defaultValue={value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select or create a format" />
      </SelectTrigger>
      <SelectContent className="min-w-[200px] z-[100]">
        {formats.map(format => (
          <div 
            key={format.value} 
            className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground relative"
          >
            <SelectItem 
              value={format.value} 
              className="flex-1 cursor-pointer"
            >
              {format.label}
            </SelectItem>
            <button
              type="button"
              className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 absolute right-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(format.value, e);
              }}
              aria-label={`Delete format ${format.label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <SelectItem
          key="add-format"
          value="__add_format__"
          className="text-blue-600 cursor-pointer border-t border-muted"
        >
          + Add new format
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
