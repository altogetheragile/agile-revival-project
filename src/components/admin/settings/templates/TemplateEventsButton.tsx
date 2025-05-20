
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TemplateEventsButton = () => {
  const navigate = useNavigate();
  
  const handleNavigateToEvents = () => {
    navigate('/admin?tab=events');
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleNavigateToEvents}
      className="flex items-center gap-1"
    >
      <Calendar className="h-4 w-4" />
      <span>View Events</span>
    </Button>
  );
};
