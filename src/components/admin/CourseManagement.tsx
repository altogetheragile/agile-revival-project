import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData, CourseMaterial } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse, addCourseMaterial } from "@/services/courseService";
import { CourseManagementHeader } from "./courses/CourseManagementHeader";
import { CourseTable } from "./courses/CourseTable";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";
import CourseRegistrations from "./courses/CourseRegistrations";
import { supabase } from "@/integrations/supabase/client";

const CourseManagement = () => {
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

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (course: Course) => {
    setDeleteCourseId(course.id);
    setIsConfirmDialogOpen(true);
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

  const uploadMaterials = async (courseId: string, materials?: File[]) => {
    if (!materials || materials.length === 0) return [];
    
    const uploadedMaterials: CourseMaterial[] = [];
    
    for (const file of materials) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${courseId}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('course_materials')
        .upload(fileName, file);
        
      if (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
        continue;
      }
      
      const { data: urlData } = supabase.storage
        .from('course_materials')
        .getPublicUrl(fileName);
        
      if (urlData) {
        const courseMaterial: CourseMaterial = {
          id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          fileName: file.name,
          fileUrl: urlData.publicUrl,
          fileType: file.type,
          fileSize: file.size
        };
        
        uploadedMaterials.push(courseMaterial);
        
        addCourseMaterial(courseId, courseMaterial);
        
        const { data: materialData, error: materialError } = await supabase
          .from('course_materials')
          .insert({
            course_id: courseId,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_type: file.type,
            file_size: file.size
          });
          
        if (materialError) {
          console.error('Error saving material metadata:', materialError);
        }
      }
    }
    
    return uploadedMaterials;
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      if (currentCourse) {
        const updated = updateCourse(currentCourse.id, data);
        
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
        const created = createCourse(data);
        
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
  
  const handleViewRegistrations = (course: Course) => {
    setCurrentCourse(course);
    setViewingRegistrations(true);
  };

  if (viewingRegistrations && currentCourse) {
    return (
      <CourseRegistrations 
        course={currentCourse}
        onBack={() => setViewingRegistrations(false)}
      />
    );
  }

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <CourseManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddCourse}
      />
      
      <CourseTable 
        courses={filteredCourses} 
        onEdit={handleEditCourse} 
        onDelete={handleDeleteConfirm}
        onViewRegistrations={handleViewRegistrations}
      />
      
      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CourseManagement;
