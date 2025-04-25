
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminBadgeProps {
  className?: string;
}

export const AdminBadge = ({ className }: AdminBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "bg-agile-purple/10 text-agile-purple border-agile-purple/20 flex items-center gap-1",
        className
      )}
    >
      <Shield className="h-3 w-3" />
      Admin
    </Badge>
  );
};

export default AdminBadge;
