
import React, { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormatInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export const FormatInput: React.FC<FormatInputProps> = ({
  value,
  onChange,
  onAdd,
  onCancel
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder="Type new format"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (value.trim()) {
              onAdd();
            }
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          onAdd();
        }}
        disabled={!value.trim()}
      >
        Add
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          onCancel();
        }}
      >
        Cancel
      </Button>
    </div>
  );
};
