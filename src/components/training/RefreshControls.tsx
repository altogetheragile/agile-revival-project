
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshControlsProps {
  isRefreshing: boolean;
  onManualRefresh: () => void;
  onForceReset: () => void;
}

const RefreshControls = ({ isRefreshing, onManualRefresh, onForceReset }: RefreshControlsProps) => {
  return (
    <div className="flex justify-end mb-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onManualRefresh}
        disabled={isRefreshing}
        className="text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh Data"}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onForceReset}
        className="text-blue-600 border-blue-300 hover:bg-blue-50"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset & Reload
      </Button>
    </div>
  );
};

export default RefreshControls;
