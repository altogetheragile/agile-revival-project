
import { Activity, Compass, BarChart3, Users, Laptop, Puzzle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/contexts/site-settings/useSiteSettings";
import { ServiceItem } from "@/contexts/site-settings/types";

const iconMap: Record<string, any> = {
  Compass,
  Users,
  Laptop,
  Activity,
  BarChart3,
  Puzzle
};

const ServiceCard = ({ title, description, icon, url }) => {
  const Icon = iconMap[icon] || Compass;
  return (
    <Card className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 hover:border-agile-purple h-full flex flex-col">
      <div className="bg-agile-purple-light p-3 rounded-full w-12 h-12 flex items-center justify-center mb-5">
        <Icon className="text-agile-purple" size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <Link to={url} className="mt-4 text-agile-purple font-medium hover:text-agile-purple-dark flex items-center gap-1">
        Learn More
      </Link>
    </Card>
  );
};

const DEFAULT_SERVICES = [
  {
    icon: "Compass",
    title: "Leadership Coaching",
    description: "Personalized one-on-one coaching to help leaders cultivate an agile mindset and empower self-organizing teams.",
    url: "/services/leadership-coaching"
  },
  {
    icon: "Users",
    title: "Team Coaching",
    description: "Collaborative coaching for agile teams using Scrum, Kanban, or hybrid methods to enhance teamwork and delivery efficiency.",
    url: "/services/team-coaching"
  },
  {
    icon: "Laptop",
    title: "Agile Training",
    description: "Engaging workshops and certification courses on agile methodologies, customized to your organization's unique context.",
    url: "/training-schedule"
  },
  {
    icon: "Activity",
    title: "Agile Facilitation",
    description: "Strategic facilitation of key agile ceremonies, retrospectives, and planning sessions to drive meaningful collaboration.",
    url: "/services/agile-facilitation"
  },
  {
    icon: "BarChart3",
    title: "Performance Metrics",
    description: "Developing insightful measurement approaches that focus on outcomes, continuous improvement, and organizational growth.",
    url: "/services/performance-metrics"
  },
  {
    icon: "Puzzle",
    title: "Custom Coaching Solutions",
    description: "Tailored, flexible coaching programs designed to address your organization's specific challenges and strategic goals.",
    url: "/services/custom-coaching"
  }
];

const ServicesSection = () => {
  const { settings } = useSiteSettings?.() || {};
  
  // Check if settings and services exist and if services has serviceItems
  const serviceItems = settings?.services?.serviceItems || [];
  
  // Use default services if no custom services are defined
  const displayServices = serviceItems.length > 0 ? serviceItems : DEFAULT_SERVICES;

  return (
    <section id="services" className="section-container bg-gradient-to-b from-white to-agile-purple-light">
      <h2 className="section-title text-agile-purple-dark">Professional Agile Coaching</h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
        Our experienced coaches provide personalized leadership development and team coaching services to help build sustainable agile practices in your organization.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((service, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <ServiceCard {...service} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
