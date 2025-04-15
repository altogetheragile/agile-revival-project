
import { Check, X } from "lucide-react";
import { User } from "@/types/user";

interface UserStatusBadgeProps {
  status: User['status'];
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  switch (status) {
    case 'active':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1" />Active</span>;
    case 'inactive':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1" />Inactive</span>;
    case 'pending':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    default:
      return null;
  }
}
