
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
import { Calendar, Clock, MapPin, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CourseGridItemProps {
  course: Course;
  onView: (courseId: string) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onReserve: (course: Course) => void;
  formatPrice: (price: string) => string;
}

const CourseGridItem: React.FC<CourseGridItemProps> = ({
  course,
  onView,
  onEdit,
  onDelete,
  onReserve,
  formatPrice
}) => {
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio?: string): number => {
    if (!ratio || ratio === "auto") return 16/9; // Default to 16:9
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };
  
  // Get image size style
  const getImageSizeStyle = (course: Course) => {
    if (!course.imageSize || course.imageSize === 100) return {};
    return { width: `${course.imageSize}%`, margin: '0 auto' };
  };
  
  // Render image based on layout
  const renderImage = () => {
    if (!course.imageUrl) return null;
    
    const imageStyle = getImageSizeStyle(course);
    
    return (
      <div className="w-full" style={imageStyle}>
        {course.imageAspectRatio === "auto" ? (
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full object-contain"
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(course.imageAspectRatio)}>
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      {course.imageUrl && renderImage()}
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
          onClick={() => onView(course.id)}
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
          onClick={() => onReserve(course)}
        >
          Reserve Spot
        </Button>
      </CardFooter>
    </Card>
  );
};

export default React.memo(CourseGridItem);
