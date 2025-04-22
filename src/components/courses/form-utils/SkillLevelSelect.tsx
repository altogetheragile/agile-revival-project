
import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SkillLevel {
  value: string;
  label: string;
}

interface SkillLevelSelectProps {
  skillLevels: SkillLevel[];
  value: string;
  onValueChange: (value: string) => void;
  onDelete: (value: string, e: React.MouseEvent) => void;
}

export const SkillLevelSelect: React.FC<SkillLevelSelectProps> = ({
  skillLevels, value, onValueChange, onDelete
}) => (
  <Select
    onValueChange={onValueChange}
    value={value}
    defaultValue={value}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select or create a skill level" />
    </SelectTrigger>
    <SelectContent className="min-w-[200px] z-[100]">
      {skillLevels.map(level => (
        <div
          key={level.value}
          className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer group relative"
        >
          <SelectItem
            value={level.value}
            className="flex-1 cursor-pointer"
          >
            {level.label}
          </SelectItem>
          <button
            type="button"
            className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600"
            onClick={e => {
              e.preventDefault(); e.stopPropagation();
              onDelete(level.value, e);
            }}
            aria-label={`Delete skill level ${level.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <SelectItem
        key="add-skill-level"
        value="__add_skill_level__"
        className="text-blue-600 cursor-pointer border-t border-muted"
      >
        + Add new skill level
      </SelectItem>
    </SelectContent>
  </Select>
);
