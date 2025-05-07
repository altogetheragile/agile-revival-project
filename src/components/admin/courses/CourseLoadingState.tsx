
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const CourseLoadingState = () => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [timeoutMessage, setTimeoutMessage] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (loadingTime === 5) {
      setTimeoutMessage("This is taking a bit longer than usual.");
    } else if (loadingTime === 15) {
      setTimeoutMessage("Taking longer than expected. There might be a connection issue.");
    } else if (loadingTime === 30) {
      setTimeoutMessage("We're experiencing some difficulties. You may want to try again later.");
    }
  }, [loadingTime]);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
      <span className="text-gray-500">Loading course templates... {loadingTime}s</span>
      
      {timeoutMessage && (
        <div className="mt-4 text-center max-w-md">
          <p className="text-sm text-amber-600">
            {timeoutMessage}
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
