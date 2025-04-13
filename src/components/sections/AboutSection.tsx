
import { CheckCircle } from "lucide-react";

const AboutSection = () => {
  const values = [
    "Client-centered approach to agile transformation",
    "Experienced coaches with real-world implementation expertise",
    "Focus on sustainable change and measurable results",
    "Adaptable methodologies tailored to your unique context"
  ];

  return (
    <section id="about" className="section-container">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 animate-fade-in">
          <img
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Team working together"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold mb-4">About Altogether Agile</h2>
          <p className="text-gray-700 mb-6">
            We are a team of passionate agile coaches and consultants dedicated to helping organizations unlock their full potential through agile methodologies. With decades of combined experience across various industries, we bring practical knowledge and a results-oriented approach to every engagement.
          </p>
          <p className="text-gray-700 mb-8">
            Our mission is to make agility accessible and effective for teams of all sizes, from startups to enterprise organizations. We believe that agile is not just about following processes but embracing a mindset that values collaboration, continuous improvement, and delivering customer value.
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
