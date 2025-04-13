
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const WorkshopFeedbackSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Workshop Butler script injection
    const script = document.createElement('script');
    script.src = "https://workshopbutler.com/js/widget.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Initialize the widget after script is loaded
      if (window.WorkshopButlerWidget) {
        window.WorkshopButlerWidget.init();
        setLoading(false);
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
        ) : null}
        
        {/* Workshop Butler testimonials widget */}
        <div 
          className="wsb-testimonials" 
          data-api-key="YOUR_API_KEY"
          data-type="recommendations"
          data-theme="light"
          data-max="6">
        </div>
      </div>
    </section>
  );
};

export default WorkshopFeedbackSection;
