
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "@/services/courseService";
import { Calendar, Clock, MapPin, Users, ArrowLeft, BookOpen, Target, GraduationCap, Clock3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import RegistrationDialog from "@/components/courses/RegistrationDialog";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = id ? getCourseById(id) : undefined;
  const [registrationOpen, setRegistrationOpen] = useState(false);

  // Convert price string to use £ symbol
  const formatPrice = (price: string | undefined) => {
    return price ? price.replace(/\$/, '£') : '';
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/training-schedule');
  };

  // Format skill level for display
  const formatSkillLevel = (level?: string) => {
    if (!level) return "All Levels";
    return level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ');
  };

  // If course is not found
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-8">The requested course could not be found.</p>
            <Button onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Course Schedule
            </Button>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Course Schedule
          </Button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {course.imageUrl && (
              <div className="w-full h-64 bg-gray-100">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8 bg-agile-purple/10">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-agile-purple-dark">{course.title}</h1>
                <div className="text-2xl font-bold">{formatPrice(course.price)}</div>
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" /> {course.dates}
              </div>
              
              {course.skillLevel && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-white">
                    {formatSkillLevel(course.skillLevel)}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">About This Course</h2>
              <p className="text-gray-700 mb-8">{course.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Course Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-agile-purple" />
                      <span>Location: {course.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-agile-purple" />
                      <span>Instructor: {course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-agile-purple" />
                      <span>{course.spotsAvailable} spots available</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-5 w-5 text-agile-purple" />
                        <span>Duration: {course.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">What You'll Learn</h3>
                  {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {course.learningOutcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Understand the key principles and practices of {course.category} methodology</li>
                      <li>Apply {course.category} techniques to real-world scenarios</li>
                      <li>Learn how to enhance team collaboration and productivity</li>
                      <li>Develop skills to address common challenges in {course.category} adoption</li>
                    </ul>
                  )}
                </div>
              </div>
              
              {(course.targetAudience || course.prerequisites) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {course.targetAudience && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-agile-purple" />
                        Target Audience
                      </h3>
                      <p className="text-gray-700">{course.targetAudience}</p>
                    </div>
                  )}
                  
                  {course.prerequisites && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-agile-purple" />
                        Prerequisites
                      </h3>
                      <p className="text-gray-700">{course.prerequisites}</p>
                    </div>
                  )}
                </div>
              )}
              
              <Separator className="my-6" />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Have questions about this course?</p>
                  <p className="text-sm text-gray-500">Contact us at courses@altogetheragile.com</p>
                </div>
                <Button size="lg" onClick={() => setRegistrationOpen(true)}>Reserve Your Spot</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
      
      <RegistrationDialog
        course={course}
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
      />
    </div>
  );
};

export default CourseDetails;
