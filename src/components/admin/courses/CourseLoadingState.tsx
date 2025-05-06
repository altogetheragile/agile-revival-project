
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const CourseLoadingState = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
      <span className="text-gray-500">Loading course templates... {loadingTime}s</span>
      
      {loadingTime > 5 && (
        <div className="mt-4 text-center max-w-md">
          <p className="text-sm text-amber-600">
            {loadingTime > 15 ? 
              "Taking longer than expected. There might be a connection issue." : 
              "This is taking a bit longer than usual."}
          </p>
          
          {loadingTime > 20 && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
            >
              Try refreshing
            </button>
          )}
        </div>
      )}
    </div>
  );
};
