
import React from "react";
import { Course } from "@/types/course";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CourseImageSettings } from "@/types/courseImage";

interface CourseImageProps {
  course: Course;
}

const CourseImage: React.FC<CourseImageProps> = ({ course }) => {
  if (!course.imageUrl) return null;

  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio?: string): number => {
    if (!ratio || ratio === "auto") return 16/9; // Default to 16:9
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };
  
  // Get image size style
  const getImageSizeStyle = (imageSettings: CourseImageSettings) => {
    if (!imageSettings.imageSize || imageSettings.imageSize === 100) return {};
    return { width: `${imageSettings.imageSize}%`, margin: '0 auto' };
  };

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

export default React.memo(CourseImage);
