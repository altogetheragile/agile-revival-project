
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export const CategoryInput: React.FC<CategoryInputProps> = ({
  value,
  onChange,
  onAdd,
  onCancel
}) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Type new category"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        className="flex-1"
        autoFocus
      />
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        disabled={!value.trim()}
      >
        Add
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};
