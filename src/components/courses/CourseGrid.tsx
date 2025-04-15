
import React from "react";
import { Course } from "@/types/course";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseGridProps {
  courses: Course[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {courses.map((course) => (
        <Card key={course.id} className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-agile-purple-dark">{course.title}</CardTitle>
            <CardDescription className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {course.dates}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-agile-purple" />
                <span>{course.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-agile-purple" />
                <span>Instructor: {course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-agile-purple" />
                <span>{course.spotsAvailable} spots available</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center">
            <div className="font-bold text-lg">{course.price}</div>
            <Button className="w-full sm:w-auto">Reserve Spot</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CourseGrid;
