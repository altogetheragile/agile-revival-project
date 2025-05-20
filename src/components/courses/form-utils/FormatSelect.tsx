
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CourseFormat } from "@/types/courseFormat";

interface FormatSelectProps {
  value: string;
  onChange?: (value: string) => void;
  onValueChange: (value: string) => void;
  formats?: CourseFormat[];
  onDelete?: (value: string, e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const FormatSelect: React.FC<FormatSelectProps> = ({ 
  value, 
  onChange, 
  onValueChange,
  formats = [],
  onDelete,
  disabled = false
}) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Select onValueChange={handleChange} value={value} defaultValue={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="in-person">In-Person</SelectItem>
        <SelectItem value="online">Online</SelectItem>
        <SelectItem value="hybrid">Hybrid</SelectItem>
        <SelectItem value="self-paced">Self-Paced</SelectItem>
        {formats.map(format => (
          <SelectItem key={format.id || format.value} value={format.value}>
            {format.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
