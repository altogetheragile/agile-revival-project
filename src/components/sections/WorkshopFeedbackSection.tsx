
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { initWorkshopButler } from '@/utils/workshopButlerLoader';
import { useToast } from '@/components/ui/use-toast';

const WorkshopFeedbackSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const apiKey = 'pk_iZTowfIlTpReqCFZlaXf9bTwHOcn2OERmKBkE2pTcyMAKQSpwdys7GhGPzsX5JgN';

  // Function to retry loading the widget
  const retryLoading = () => {
    if (retryCount < 3) {
      setRetryCount(prevCount => prevCount + 1);
      setLoading(true);
      setError(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadWidget = async () => {
      try {
        // Wait for Workshop Butler to initialize
        console.log(`Attempting to initialize Workshop Butler (attempt ${retryCount + 1})`);
        await initWorkshopButler();
        
        // Only update state if component is still mounted
        if (isMounted) {
          if (window.WorkshopButlerWidget) {
            console.log("Workshop Butler widget initialized in WorkshopFeedbackSection");
            setLoading(false);
            
            // Force the widget to re-render
            setTimeout(() => {
              try {
                if (window.WorkshopButlerWidget) {
                  window.WorkshopButlerWidget.init();
                }
              } catch (e) {
                console.error("Error re-initializing widget:", e);
              }
            }, 100);
          } else {
            console.error("Workshop Butler widget not available after initialization");
            setError("Failed to initialize Workshop Butler widget");
            setLoading(false);
            
            toast({
              title: "Widget Error",
              description: "Failed to load testimonials. Click to retry.",
              variant: "destructive",
              action: (
                <button 
                  onClick={retryLoading}
                  className="bg-white text-red-600 px-2 py-1 text-xs rounded"
                >
                  Retry
                </button>
              )
            });
          }
        }
      } catch (e) {
        console.error("Error initializing Workshop Butler widget:", e);
        if (isMounted) {
          setError("Failed to load Workshop Butler widget");
          setLoading(false);
          
          toast({
            title: "Widget Error",
            description: "Failed to load testimonials. Click to retry.",
            variant: "destructive",
            action: (
              <button 
                onClick={retryLoading}
                className="bg-white text-red-600 px-2 py-1 text-xs rounded"
              >
                Retry
              </button>
            )
          });
        }
      }
    };
    
    loadWidget();
    
    return () => {
      isMounted = false;
    };
  }, [retryCount, toast]);
  
  // Add console log to check if the component is rendering
  console.log("Rendering WorkshopFeedbackSection, loading:", loading, "error:", error, "retryCount:", retryCount);

  return (
    <section id="workshop-feedback" className="section-container bg-gradient-to-br from-blue-100 to-white py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-blue-800">Workshop Feedback</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Hear what participants say about our agile workshops and training sessions.
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={retryLoading} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={retryCount >= 3}
            >
              {retryCount >= 3 ? "Please refresh the page" : "Try Again"}
            </button>
          </div>
        ) : (
          <div>
            {/* Workshop Butler testimonials widget */}
            <div 
              className="wsb-testimonials" 
              data-api-key={apiKey}
              data-type="recommendations"
              data-theme="light"
              data-max="6">
            </div>
            
            {/* Fallback if widget doesn't render */}
            <div id="workshop-fallback" className="mt-8 hidden">
              <p className="text-center text-gray-600">
                If you cannot see the testimonials above, please 
                <button 
                  onClick={retryLoading}
                  className="mx-1 text-blue-600 underline hover:text-blue-800"
                >
                  click here
                </button> 
                to reload them.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Add a script to detect if the widget is empty and show fallback */}
      {!loading && !error && (
        <script dangerouslySetInnerHTML={{ __html: `
          setTimeout(() => {
            const widgetContainer = document.querySelector('.wsb-testimonials');
            const fallback = document.getElementById('workshop-fallback');
            if (widgetContainer && widgetContainer.children.length === 0 && fallback) {
              fallback.classList.remove('hidden');
            }
          }, 3000);
        `}} />
      )}
    </section>
  );
};

export default WorkshopFeedbackSection;
