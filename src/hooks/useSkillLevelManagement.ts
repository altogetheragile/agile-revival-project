
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";

export const useSkillLevelManagement = () => {
  const [skillLevels, setSkillLevels] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newSkillLevel, setNewSkillLevel] = useState("");
  const { toast } = useToast();
  const { settings, updateSettings } = useSiteSettings();

  useEffect(() => {
    if (settings.skillLevels && Array.isArray(settings.skillLevels)) {
      setSkillLevels(settings.skillLevels);
    } else {
      setSkillLevels([
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
        { value: "all-levels", label: "All Levels" },
      ]);
    }
  }, [settings]);

  const saveSkillLevelsToSettings = async (updated: { value: string; label: string }[]) => {
    try {
      await updateSettings('skillLevels', updated);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleAddSkillLevel = async (onAdd: (value: string) => void) => {
    if (
      newSkillLevel.trim() &&
      !skillLevels.some(opt => opt.value.toLowerCase() === newSkillLevel.trim().toLowerCase())
    ) {
      const val = newSkillLevel.trim().toLowerCase().replace(/\s+/g, "-");
      const label = newSkillLevel.trim();
      const newLevel = { value: val, label };
      const updated = [...skillLevels, newLevel];
      const success = await saveSkillLevelsToSettings(updated);
      if (success) {
        setSkillLevels(updated);
        onAdd(val);
        setAddMode(false);
        setNewSkillLevel("");
        toast({
          title: "Skill level added",
          description: `"${label}" has been added.`,
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem adding the skill level.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteSkillLevel = async (value: string, onDelete: (value: string) => void) => {
    const updated = skillLevels.filter(level => level.value !== value);
    const deleted = skillLevels.find(level => level.value === value);
    const success = await saveSkillLevelsToSettings(updated);
    if (success) {
      setSkillLevels(updated);
      onDelete(value);
      toast({
        title: "Skill level deleted",
        description: `"${deleted?.label || value}" has been removed.`,
      });
    } else {
      toast({
        title: "Error",
        description: "There was a problem deleting the skill level.",
        variant: "destructive",
      });
    }
  };

  return {
    skillLevels,
    addMode,
    setAddMode,
    newSkillLevel,
    setNewSkillLevel,
    handleAddSkillLevel,
    handleDeleteSkillLevel,
  };
};
