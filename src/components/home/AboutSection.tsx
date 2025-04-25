
import { CheckCircle } from "lucide-react";

const AboutSection = () => {
  const highlights = [
    "20+ years of combined experience",
    "Certified Professional Coaches",
    "Industry-recognized methodologies",
    "Customized approach for each organization"
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Our Approach</h2>
            <p className="text-gray-600 mb-8">
              We are passionate about helping organizations achieve their full potential through agile transformation. Our experienced coaches bring real-world expertise and proven methodologies to guide your teams toward success.
            </p>
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-agile-purple w-5 h-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80"
              alt="Mountain summit representing achievement"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
