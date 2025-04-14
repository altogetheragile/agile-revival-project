
import React from "react";
import { Calendar, Clock, MapPin, Users, Bookmark, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  isMobile?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, isMobile }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative">
        <div className="flex flex-col">
          <CardTitle className="text-agile-purple-dark">{course.title}</CardTitle>
          <CardDescription className="font-medium flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" /> {course.dates}
          </CardDescription>
        </div>
        
        {onEdit && onDelete && (
          <div className={`${isMobile ? 'flex mt-4' : 'absolute top-4 right-4 flex'} gap-2`}>
            <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(course)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{course.description}</p>
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
        <Button className="w-full sm:w-auto">
          <Bookmark className="mr-2 h-4 w-4" /> Reserve Spot
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
