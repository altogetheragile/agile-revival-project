
import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Bookmark, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import RegistrationDialog from "./RegistrationDialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  isMobile?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete, isMobile }) => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Reset image error state when course changes
    setImageError(false);
  }, [course.imageUrl]);
  
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio?: string): number => {
    if (!ratio || ratio === "auto") return 16/9; // Default to 16:9
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };
  
  // Get image size style
  const getImageSizeStyle = () => {
    if (!course.imageSize || course.imageSize === 100) return {};
    return { width: `${course.imageSize}%`, margin: '0 auto' };
  };
  
  // Handle image loading error
  const handleImageError = () => {
    console.error(`Failed to load image for course: ${course.id} - ${course.title}`);
    setImageError(true);
  };
  
  // Render image based on layout
  const renderImage = () => {
    if (!course.imageUrl || imageError) {
      return (
        <div className="w-full bg-gray-100 flex items-center justify-center" style={getImageSizeStyle()}>
          <div className="text-gray-400 p-8 text-center">
            <Calendar className="mx-auto h-10 w-10 mb-2" />
            <p>{course.title}</p>
          </div>
        </div>
      );
    }
    
    const imageStyle = getImageSizeStyle();
    
    return (
      <div className="w-full overflow-hidden" style={imageStyle}>
        {course.imageAspectRatio === "auto" ? (
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full object-contain"
            onError={handleImageError}
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(course.imageAspectRatio)}>
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </AspectRatio>
        )}
      </div>
    );
  };
  
  // Render card content based on layout
  const renderCardLayout = () => {
    const layout = course.imageLayout || "standard";
    
    if (layout === "side-by-side" && course.imageUrl) {
      return (
        <Card className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              {renderImage()}
            </div>
            <div className="md:w-1/2">
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
                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => setRegistrationOpen(true)}
                >
                  <Bookmark className="mr-2 h-4 w-4" /> Reserve Spot
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      );
    }
    
    if (layout === "image-left" && course.imageUrl) {
      return (
        <Card className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-4">
              {renderImage()}
            </div>
            <div className="md:w-2/3">
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
                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => setRegistrationOpen(true)}
                >
                  <Bookmark className="mr-2 h-4 w-4" /> Reserve Spot
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      );
    }
    
    // Default layout (standard, image-top, full-width, etc.)
    return (
      <Card className="h-full flex flex-col">
        {course.imageUrl && renderImage()}
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
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setRegistrationOpen(true)}
          >
            <Bookmark className="mr-2 h-4 w-4" /> Reserve Spot
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <>
      {renderCardLayout()}
      
      <RegistrationDialog 
        course={course}
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
      />
    </>
  );
};

export default CourseCard;
