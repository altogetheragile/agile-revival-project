
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/course";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RegistrationDialog from "./RegistrationDialog";
import { Badge } from "@/components/ui/badge";

interface CourseGridProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  
  // Convert price string to use £ symbol
  const formatPrice = (price: string) => {
    return price.replace(/\$/, '£');
  };

  // Handle Details button click to navigate to course details page
  const handleViewDetails = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  // Handle Reserve Spot button click
  const handleReserveClick = (course: Course) => {
    setSelectedCourse(course);
    setRegistrationOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
        {courses.map((course) => (
          <Card key={course.id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-agile-purple-dark text-2xl flex items-center gap-2">
                    {course.title}
                    {course.status === 'draft' && (
                      <Badge variant="outline" className="ml-2 text-amber-600 border-amber-600">
                        Draft
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="font-medium flex items-center gap-2 mt-2 text-base">
                    <Calendar className="h-5 w-5 text-agile-purple" /> {course.dates}
                  </CardDescription>
                </div>
                <div className="font-bold text-2xl">{formatPrice(course.price)}</div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow py-4">
              <p className="text-gray-600 mb-6 line-clamp-3 text-base">{course.description}</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-agile-purple" />
                  <span className="text-base">{course.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-agile-purple" />
                  <span className="text-base">Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-agile-purple" />
                  <span className="text-base">{course.spotsAvailable} spots available</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="flex gap-2"
                onClick={() => handleViewDetails(course.id)}
              >
                <Eye className="h-4 w-4" /> Details
              </Button>
              
              {onEdit && (
                <Button 
                  variant="outline" 
                  className="flex gap-2"
                  onClick={() => onEdit(course)}
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="outline" 
                  className="flex gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              )}
              
              <div className="flex-grow"></div>
              
              <Button 
                className="bg-agile-purple hover:bg-agile-purple-dark text-white px-6"
                onClick={() => handleReserveClick(course)}
              >
                Reserve Spot
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <RegistrationDialog
        course={selectedCourse}
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
      />
    </>
  );
};

export default CourseGrid;
