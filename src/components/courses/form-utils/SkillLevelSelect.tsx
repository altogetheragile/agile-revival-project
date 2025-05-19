
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getAllSkillLevels, createSkillLevel, SkillLevel } from "@/services/skillLevel/skillLevelService";

interface SkillLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SkillLevelSelect: React.FC<SkillLevelSelectProps> = ({
  value,
  onChange,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [newSkillLevelOpen, setNewSkillLevelOpen] = useState(false);
  const [skillLevels, setSkillLevels] = useState<SkillLevel[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load skill levels on component mount
  useEffect(() => {
    fetchSkillLevels();
  }, []);

  const fetchSkillLevels = async () => {
    setLoading(true);
    try {
      const data = await getAllSkillLevels();
      setSkillLevels(data);
    } catch (error) {
      console.error("Failed to fetch skill levels:", error);
      toast({
        title: "Error",
        description: "Failed to load skill levels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewSkillLevel = async () => {
    if (!newLabel.trim() || !newValue.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a label and a value",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const skillLevel = await createSkillLevel({
        label: newLabel.trim(),
        value: newValue.trim().toLowerCase()
      });
      
      if (skillLevel) {
        toast({
          title: "Success",
          description: "New skill level created"
        });
        setNewSkillLevelOpen(false);
        fetchSkillLevels();
        onChange(skillLevel.value);
        
        // Reset form
        setNewLabel("");
        setNewValue("");
      }
    } catch (error) {
      console.error("Failed to create skill level:", error);
      toast({
        title: "Error",
        description: "Failed to create new skill level",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentSkillLevel = skillLevels.find((level) => level.value === value);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {value
              ? currentSkillLevel?.label || value
              : "Select skill level..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search skill levels..." />
            <CommandList>
              <CommandEmpty>No skill level found.</CommandEmpty>
              <CommandGroup>
                {skillLevels.map((level) => (
                  <CommandItem
                    key={level.id}
                    value={level.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === level.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {level.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setNewSkillLevelOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create new skill level
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={newSkillLevelOpen} onOpenChange={setNewSkillLevelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new skill level</DialogTitle>
            <DialogDescription>
              Create a new skill level option for courses
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right">
                Display Label
              </Label>
              <Input
                id="label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Expert"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value ID
              </Label>
              <Input
                id="value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., expert"
                className="col-span-3"
              />
              <p className="text-xs text-muted-foreground col-start-2 col-span-3">
                This is used internally. Use lowercase with hyphens.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewSkillLevelOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleNewSkillLevel} disabled={loading}>
              {loading ? "Creating..." : "Create Skill Level"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
