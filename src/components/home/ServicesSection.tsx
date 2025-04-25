
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, Users, BarChart3, Compass } from "lucide-react";

const ServiceCard = ({ icon: Icon, title, description, link }) => (
  <Card className="p-6 hover:shadow-lg transition-all">
    <Icon className="w-8 h-8 text-agile-purple mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={link} className="text-agile-purple hover:underline">
      Learn more →
    </Link>
  </Card>
);

const ServicesSection = () => {
  const services = [
    {
      icon: Compass,
      title: "Leadership Coaching",
      description: "Develop strong agile leaders who can guide teams through transformation.",
      link: "/services/leadership-coaching"
    },
    {
      icon: Users,
      title: "Team Coaching",
      description: "Build high-performing agile teams through expert coaching and guidance.",
      link: "/services/team-coaching"
    },
    {
      icon: Activity,
      title: "Agile Facilitation",
      description: "Professional facilitation for workshops, events and ceremonies.",
      link: "/services/agile-facilitation"
    },
    {
      icon: BarChart3,
      title: "Performance Metrics",
      description: "Measure and improve your agile transformation journey.",
      link: "/services/performance-metrics"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
