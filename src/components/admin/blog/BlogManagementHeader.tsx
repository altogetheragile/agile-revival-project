
import { PlusCircle, Search, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  onSeedData?: () => void;
  showSeedButton?: boolean;
}

export const BlogManagementHeader = ({ 
  searchTerm, 
  onSearchChange, 
  onAddNew, 
  onSeedData,
  showSeedButton = false 
}: BlogManagementHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Blog Management</h2>
        <div className="flex gap-2">
          {showSeedButton && onSeedData && (
            <Button 
              onClick={onSeedData} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Database size={16} /> Seed Sample Posts
            </Button>
          )}
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <PlusCircle size={16} /> Add New Post
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search blog posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};
