
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
  const handleDeleteClick = (formatValue: string, e: React.MouseEvent) => {
    // Prevent any default behaviors and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete button clicked for format:", formatValue);
    // Call the delete handler with the format value
    onDelete(formatValue, e);
    // Return false to prevent any other handlers from executing
    return false;
  };

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
            className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground relative cursor-pointer"
          >
            <SelectItem 
              value={format.value} 
              className="flex-1 cursor-pointer"
            >
              {format.label}
            </SelectItem>
            <button
              type="button"
              className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 absolute right-2 z-[200]"
              onClick={(e) => handleDeleteClick(format.value, e)}
              aria-label={`Delete format ${format.label}`}
              onMouseDown={(e) => {
                // Prevent the select from closing when clicking the delete button
                e.stopPropagation();
                e.preventDefault();
              }}
              onKeyDown={(e) => {
                // Prevent keyboard events from propagating
                e.stopPropagation();
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        <div className="border-t border-muted">
          <SelectItem
            value="__add_format__"
            className="text-blue-600 cursor-pointer"
          >
            + Add new format
          </SelectItem>
        </div>
      </SelectContent>
    </Select>
  );
};
