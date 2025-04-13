
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
      title: "Leadership Coaching",
      description: "One-on-one coaching for leaders to develop an agile mindset and effectively support self-organizing teams.",
      icon: Compass
    },
    {
      title: "Team Coaching",
      description: "Hands-on coaching for agile teams using Scrum, Kanban, or hybrid approaches to improve collaboration and delivery.",
      icon: Users
    },
    {
      title: "Agile Training",
      description: "Interactive workshops and certification courses on agile methodologies, tailored to your organization's context.",
      icon: Laptop
    },
    {
      title: "Agile Facilitation",
      description: "Expert facilitation of key agile ceremonies, retrospectives, and strategic planning sessions.",
      icon: Activity
    },
    {
      title: "Performance Metrics",
      description: "Developing meaningful measurement approaches that focus on outcomes and support continuous improvement.",
      icon: BarChart3
    },
    {
      title: "Custom Coaching Solutions",
      description: "Tailored coaching programs designed to address your organization's unique challenges and goals.",
      icon: Puzzle
    }
  ];

  return (
    <section id="services" className="section-container bg-gradient-to-b from-white to-agile-purple-light">
      <h2 className="section-title text-agile-purple-dark">Professional Agile Coaching</h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
        Our experienced coaches provide personalized leadership development and team coaching services to help build sustainable agile practices in your organization.
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
