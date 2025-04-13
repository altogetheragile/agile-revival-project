
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { initWorkshopButler } from '@/utils/workshopButlerLoader';

const WorkshopFeedbackSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiKey = 'pk_iZTowfIlTpReqCFZlaXf9bTwHOcn2OERmKBkE2pTcyMAKQSpwdys7GhGPzsX5JgN';

  useEffect(() => {
    // Use the utility function instead of inline script loading
    const loadWidget = async () => {
      try {
        // Wait for Workshop Butler to initialize
        await initWorkshopButler();
        
        // Check if widget was properly initialized
        if (window.WorkshopButlerWidget) {
          console.log("Workshop Butler widget initialized in WorkshopFeedbackSection");
          setLoading(false);
        } else {
          console.error("Workshop Butler widget not available after initialization");
          setError("Failed to initialize Workshop Butler widget");
          setLoading(false);
        }
      } catch (e) {
        console.error("Error initializing Workshop Butler widget:", e);
        setError("Failed to initialize Workshop Butler widget");
        setLoading(false);
      }
    };
    
    loadWidget();
    
    // No cleanup needed here as the utility handles script cleanup
  }, []);

  // Add console log to check if the component is rendering
  console.log("Rendering WorkshopFeedbackSection, loading:", loading, "error:", error);

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
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center text-red-700">
            {error}. Please try refreshing the page.
          </div>
        ) : null}
        
        {/* Workshop Butler testimonials widget */}
        <div 
          className="wsb-testimonials" 
          data-api-key={apiKey}
          data-type="recommendations"
          data-theme="light"
          data-max="6">
        </div>
      </div>
    </section>
  );
};

export default WorkshopFeedbackSection;
