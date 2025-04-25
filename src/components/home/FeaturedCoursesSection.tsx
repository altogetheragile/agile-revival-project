
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const FeaturedCoursesSection = () => {
  const featuredCourses = [
    {
      title: "Professional Scrum Master",
      duration: "2 days",
      level: "Intermediate",
      price: "$1,195",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Agile Leadership",
      duration: "3 days",
      level: "Advanced",
      price: "$1,495",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Courses</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Enhance your agile journey with our professional certification courses
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredCourses.map((course, index) => (
            <Card key={index} className="overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <span>Duration: {course.duration}</span>
                  <span>Level: {course.level}</span>
                  <span>Price: {course.price}</span>
                </div>
                <Button asChild>
                  <Link to="/training-schedule">Learn More</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/training-schedule">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCoursesSection;
