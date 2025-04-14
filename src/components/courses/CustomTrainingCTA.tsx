
import React from 'react';
import { Button } from '@/components/ui/button';

const CustomTrainingCTA = () => {
  return (
    <div className="mt-12 text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Need a custom training solution?</h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        We offer tailored training programs for organizations of all sizes.
        Contact us to discuss your specific needs and goals.
      </p>
      <Button size="lg">
        Request Custom Training
      </Button>
    </div>
  );
};

export default CustomTrainingCTA;
