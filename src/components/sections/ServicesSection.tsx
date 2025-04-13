
import { Activity, Compass, BarChart3, Users, Laptop, Puzzle } from "lucide-react";
import { Card } from "@/components/ui/card";

const ServiceCard = ({ title, description, icon: Icon }) => {
  return (
    <Card className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 hover:border-agile-purple h-full flex flex-col">
      <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-5">
        <Icon className="text-agile-purple" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <a href="#contact" className="mt-4 text-agile-purple font-medium hover:text-agile-purple-dark flex items-center gap-1">
        Learn More
      </a>
    </Card>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Agile Transformation",
      description: "We guide organizations through the process of adopting agile practices and mindsets at scale.",
      icon: Compass
    },
    {
      title: "Agile Team Coaching",
      description: "Our coaches work directly with teams to improve their effectiveness using Scrum, Kanban, or hybrid approaches.",
      icon: Users
    },
    {
      title: "Leadership Development",
      description: "We help leaders develop the skills to support and enable agile teams to thrive.",
      icon: Activity
    },
    {
      title: "Agile Training & Workshops",
      description: "Practical, hands-on training customized for your organization's specific needs.",
      icon: Laptop
    },
    {
      title: "Metrics & Measurement",
      description: "Develop meaningful measurement approaches that support continuous improvement.",
      icon: BarChart3
    },
    {
      title: "Custom Agile Solutions",
      description: "Tailored agile approaches designed to address your unique challenges.",
      icon: Puzzle
    }
  ];

  return (
    <section id="services" className="section-container bg-gradient-to-b from-white to-agile-purple-light">
      <h2 className="section-title text-agile-purple-dark">Our Services</h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
        We offer a comprehensive range of agile coaching and consulting services to help your organization become more adaptive, collaborative, and sustainable.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
