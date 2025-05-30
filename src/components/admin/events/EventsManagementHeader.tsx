
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EventsManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
}

export const EventsManagementHeader: React.FC<EventsManagementHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddNew
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Events Management</h1>
        <p className="text-muted-foreground text-sm">Manage your events, workshops, webinars, and other activities</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Event
        </Button>
      </div>
    </div>
  );
};
