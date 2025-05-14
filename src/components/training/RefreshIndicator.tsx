
import { RefreshCw } from "lucide-react";

interface RefreshIndicatorProps {
  isRefreshing: boolean;
}

const RefreshIndicator = ({ isRefreshing }: RefreshIndicatorProps) => {
  if (!isRefreshing) return null;
  
  return (
    <div className="bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded-md mb-2 flex items-center justify-center">
      <RefreshCw className="h-3 w-3 animate-spin mr-1" /> 
      Refreshing data...
    </div>
  );
};

export default RefreshIndicator;
