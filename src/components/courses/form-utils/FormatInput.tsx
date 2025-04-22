
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (value.trim()) {
      console.log("Format input form submitted with value:", value);
      onAdd();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (value.trim()) {
        console.log("Enter key pressed in format input with value:", value);
        onAdd();
      }
    } else if (e.key === "Escape") {
      e.preventDefault(); 
      e.stopPropagation();
      console.log("Escape key pressed in format input");
      onCancel();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        ref={inputRef}
        placeholder="Type new format"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        onClick={(e) => e.stopPropagation()}
      />
      <Button
        type="button"
        variant="outline"
        disabled={!value.trim()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (value.trim()) {
            console.log("Add button clicked with value:", value);
            onAdd();
          }
        }}
      >
        Add
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Cancel button clicked in format input");
          onCancel();
        }}
      >
        Cancel
      </Button>
    </form>
  );
};
