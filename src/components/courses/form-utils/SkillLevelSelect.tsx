
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SkillLevel {
  id?: string;
  value: string;
  label: string;
}

interface SkillLevelSelectProps {
  value: string;
  onChange?: (value: string) => void;
  onValueChange: (value: string) => void;
  skillLevels?: SkillLevel[];
  disabled?: boolean;
}

export const SkillLevelSelect: React.FC<SkillLevelSelectProps> = ({ 
  value, 
  onChange, 
  onValueChange,
  skillLevels = [],
  disabled = false
}) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Select onValueChange={handleChange} value={value} defaultValue={value} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select skill level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
        <SelectItem value="all-levels">All Levels</SelectItem>
        {skillLevels.map(level => (
          <SelectItem key={level.id || level.value} value={level.value}>
            {level.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
