
import React from 'react';
import { Loader2 } from 'lucide-react';

const TestimonialsLoading: React.FC = () => {
  return (
    <div className="px-4 md:px-10 py-6 flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-gray-600">Loading testimonials...</p>
      </div>
    </div>
  );
};

export default TestimonialsLoading;
