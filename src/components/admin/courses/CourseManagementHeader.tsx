
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CourseManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddNew: () => void;
  isTemplateView?: boolean;
}

export const CourseManagementHeader: React.FC<CourseManagementHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddNew,
  isTemplateView = false
}) => {
  const title = isTemplateView ? "Event Templates" : "Event Management";
  const buttonText = isTemplateView ? "Add Template" : "Add Event";
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {isTemplateView 
            ? "Create and manage event templates for quick scheduling" 
            : "Manage and schedule your events"
          }
        </p>
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Input
          placeholder="Search events..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        <Button 
          onClick={onAddNew}
          size="sm"
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>{buttonText}</span>
        </Button>
      </div>
    </div>
  );
};
