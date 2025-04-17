
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData, CourseMaterial } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse, addCourseMaterial } from "@/services/courseService";
import { supabase } from "@/integrations/supabase/client";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const { toast } = useToast();

  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower)
    );
  });

  const uploadMaterials = async (courseId: string, materials?: File[]) => {
    if (!materials || materials.length === 0) return [];
    
    const uploadedMaterials: CourseMaterial[] = [];
    
    for (const file of materials) {
      try {
        // Check file size - reject if too large (10MB per file)
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxFileSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 10MB limit`,
            variant: "destructive"
          });
          continue;
        }
        
        // Generate a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${courseId}/${fileName}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('course_materials')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}: ${error.message}`,
            variant: "destructive"
          });
          continue;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('course_materials')
          .getPublicUrl(filePath);
          
        if (urlData && urlData.publicUrl) {
          // Create course material object
          const courseMaterial: CourseMaterial = {
            id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            fileName: file.name,
            fileUrl: urlData.publicUrl,
            fileType: file.type,
            fileSize: file.size
          };
          
          // Save to local storage via the service
          uploadedMaterials.push(courseMaterial);
          await addCourseMaterial(courseId, courseMaterial);
          
          // Add to database (optional, as we're using localStorage)
          try {
            await supabase
              .from('course_materials')
              .insert({
                course_id: courseId,
                file_name: file.name,
                file_url: urlData.publicUrl,
                file_type: file.type,
                file_size: file.size
              });
          } catch (dbErr) {
            // Log error but don't fail the upload as we've already stored it locally
            console.warn('Error saving to database:', dbErr);
          }
        }
      } catch (err) {
        console.error('Error processing file upload:', err);
        toast({
          title: "Upload Error",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    return uploadedMaterials;
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      // Handle Google Drive folder information
      const googleDriveData = {
        googleDriveFolderId: data.googleDriveFolderId,
        googleDriveFolderUrl: data.googleDriveFolderUrl
      };
      
      if (currentCourse) {
        const updated = updateCourse(currentCourse.id, {
          ...data,
          ...googleDriveData
        });
        
        if (updated && data.materials && data.materials.length > 0) {
          await uploadMaterials(currentCourse.id, data.materials);
        }
        
        if (updated) {
          setCourses(getAllCourses());
          toast({
            title: "Course updated",
            description: `"${data.title}" has been updated successfully.`
          });
        }
      } else {
        const created = createCourse({
          ...data,
          ...googleDriveData
        });
        
        if (data.materials && data.materials.length > 0) {
          await uploadMaterials(created.id, data.materials);
        }
        
        setCourses(getAllCourses());
        toast({
          title: "Course created",
          description: `"${created.title}" has been ${data.status === 'published' ? 'published' : 'saved as draft'}.`
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error handling course submission:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the course.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (deleteCourseId) {
      if (deleteCourse(deleteCourseId)) {
        setCourses(getAllCourses());
        toast({
          title: "Course deleted",
          description: "The course has been removed successfully."
        });
      }
      setIsConfirmDialogOpen(false);
      setDeleteCourseId(null);
    }
  };

  return {
    courses: filteredCourses,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    setIsFormOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    currentCourse,
    setCurrentCourse,
    deleteCourseId,
    setDeleteCourseId,
    viewingRegistrations,
    setViewingRegistrations,
    handleFormSubmit,
    handleDelete
  };
};
