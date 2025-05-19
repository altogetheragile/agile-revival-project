
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface FormatSelectProps {
  value: string;
  onChange?: (value: string) => void;
  onValueChange: (value: string) => void;
}

export const FormatSelect: React.FC<FormatSelectProps> = ({ 
  value, 
  onChange, 
  onValueChange 
}) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Select onValueChange={handleChange} value={value} defaultValue={value}>
      <SelectTrigger>
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="in-person">In-Person</SelectItem>
        <SelectItem value="online">Online</SelectItem>
        <SelectItem value="hybrid">Hybrid</SelectItem>
        <SelectItem value="self-paced">Self-Paced</SelectItem>
      </SelectContent>
    </Select>
  );
};
