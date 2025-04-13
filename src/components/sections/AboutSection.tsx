
import { CheckCircle } from "lucide-react";

const AboutSection = () => {
  const values = [
    "Professional coaching expertise with industry certifications",
    "Practical, hands-on approach to leadership development",
    "Focus on sustainable skills development and coaching culture",
    "Evidence-based methods adapted to your organizational context"
  ];

  return (
    <section id="about" className="section-container bg-white">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 animate-fade-in">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
            alt="Team collaboration session in natural setting"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold mb-4 text-agile-purple-dark">About Our Coaching Approach</h2>
          <p className="text-gray-700 mb-6">
            We are professional agile coaches with extensive experience in leadership development and team coaching. Our certified coaches bring real-world expertise from various industries, focusing on practical skills that create lasting results.
          </p>
          <p className="text-gray-700 mb-8">
            Our coaching philosophy centers on building internal capability and a sustainable coaching culture within your organization. We believe effective agile coaching goes beyond processes to develop the mindset, behaviors, and leadership skills needed for true organizational agility.
          </p>
          <div className="space-y-3">
            {values.map((value, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="text-agile-purple shrink-0 mt-1" size={20} />
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
