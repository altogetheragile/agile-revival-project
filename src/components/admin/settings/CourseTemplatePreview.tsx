import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Course, CourseTemplate } from "@/types/course";

interface CourseTemplatePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: CourseTemplate | null;
}

export const CourseTemplatePreview: React.FC<CourseTemplatePreviewProps> = ({
  open,
  onOpenChange,
  template
}) => {
  // Local state to ensure we always use the latest template data
  const [previewData, setPreviewData] = useState<CourseTemplate | null>(null);
  
  // Update local state whenever the template prop changes
  useEffect(() => {
    if (template) {
      // Add a cache-busting parameter to the image URL if it exists
      let updatedTemplate = {...template};
      
      if (updatedTemplate.imageUrl) {
        const timestamp = Date.now();
        const baseUrl = updatedTemplate.imageUrl.split('?')[0];
        updatedTemplate.imageUrl = `${baseUrl}?cache=${timestamp}`;
      }
      
      setPreviewData(updatedTemplate);
    } else {
      setPreviewData(null);
    }
  }, [template, open]);

  if (!previewData) return null;

  // Format skill level for display
  const formatSkillLevel = (level?: string) => {
    if (!level) return "All Levels";
    return level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview: {previewData.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="bg-white rounded-lg overflow-hidden">
            {previewData.imageUrl && (
              <div className="w-full h-64 bg-gray-100">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={previewData.imageUrl} 
                    alt={previewData.title} 
                    className="w-full h-full object-cover"
                    key={previewData.imageUrl} // Key helps React recognize this as a new image
                  />
                </AspectRatio>
              </div>
            )}
            
            <div className="p-6 bg-agile-purple/10">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-agile-purple-dark">{previewData.title}</h1>
                <div className="text-xl font-bold">{previewData.price}</div>
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" /> Example Date
              </div>
              
              {previewData.skillLevel && (
                <div className="mt-2">
                  <Badge variant="outline" className="bg-white">
                    {formatSkillLevel(previewData.skillLevel)}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-3">About This Course</h2>
              <p className="text-gray-700 mb-6">{previewData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Course Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-agile-purple" />
                      <span>Location: Example Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-agile-purple" />
                      <span>Instructor: Example Instructor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-agile-purple" />
                      <span>Duration: {previewData.duration || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">What You'll Learn</h3>
                  {previewData.learningOutcomes && previewData.learningOutcomes.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {previewData.learningOutcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No learning outcomes specified</p>
                  )}
                </div>
              </div>
              
              {(previewData.targetAudience || previewData.prerequisites) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {previewData.targetAudience && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Target Audience</h3>
                      <p className="text-gray-700">{previewData.targetAudience}</p>
                    </div>
                  )}
                  
                  {previewData.prerequisites && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Prerequisites</h3>
                      <p className="text-gray-700">{previewData.prerequisites}</p>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-6">
                <em>This is a preview of how the course will appear to students. The actual dates, location, and instructor information will be added when scheduling an instance of this course.</em>
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CourseTemplatePreview;
