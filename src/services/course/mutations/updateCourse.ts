
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "../courseMappers";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";
import { updateCoursesFromTemplate, TemplatePropagationResult } from "@/services/templates/templatePropagation";

export const updateCourse = async (
  id: string, 
  courseData: CourseFormData, 
  propagateChanges: boolean = false
): Promise<Course | null> => {
  try {
    console.log("Updating course:", id, "Data:", courseData);
    console.log("Course ID type:", typeof id);
    console.log("Propagate changes:", propagateChanges);
    
    if (!id) {
      console.error("Missing ID for update operation");
      toast.error("Update failed: Missing ID");
      return null;
    }
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) return null;

    // If this is a template, verify admin role
    if (courseData.isTemplate && !(await checkAdminRole(user.id))) {
      toast.error("Permission denied", {
        description: "You need admin privileges to update templates"
      });
      return null;
    }

    // Log the incoming courseData
    console.log("Input course data:", courseData);

    // Apply any necessary transformations to the course data
    const dbCourseData = mapCourseToDb(courseData);
    
    // Create update data object directly without destructuring
    const updateData = { ...dbCourseData };
    console.log("Update data prepared:", updateData);
    
    // Use optimized query with better error handling
    const { data, error } = await executeQuery<any>(
      async () => await supabase
        .from('courses')
        .update({ 
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to update course",
        retries: 2
      }
    );

    if (error) {
      console.error("Error in updateCourse:", error);
      handleMutationError(error, "Failed to update course");
      return null;
    }
    
    if (!data) {
      console.error("No data returned from update operation");
      toast.error("Failed to update course", {
        description: "The database returned no data after update"
      });
      return null;
    }

    console.log("Course updated successfully:", data);
    
    // Handle propagation to derived courses if this is a template
    let propagationResult: TemplatePropagationResult = { 
      success: true, 
      updatedCount: 0, 
      updatedFields: [] 
    };
    
    if (courseData.isTemplate && propagateChanges) {
      try {
        // Fields that should be propagated to derived courses
        const propagateFields = {
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          learning_outcomes: courseData.learningOutcomes as string[],
          prerequisites: courseData.prerequisites,
          target_audience: courseData.targetAudience,
          duration: courseData.duration,
          skill_level: courseData.skillLevel,
          format: courseData.format,
          price: courseData.price,
          event_type: courseData.eventType,
          image_url: courseData.imageUrl,
          image_aspect_ratio: courseData.imageAspectRatio,
          image_size: courseData.imageSize,
          image_layout: courseData.imageLayout
        };
        
        propagationResult = await updateCoursesFromTemplate(id, propagateFields);
        
        if (!propagationResult.success && propagationResult.error) {
          console.error("Error propagating changes:", propagationResult.error);
          // Show error but don't fail the whole operation since the template was updated
          toast.error("Warning: Template updated but some courses failed to update", {
            description: propagationResult.error
          });
        } else if (propagationResult.updatedCount > 0) {
          const fieldsList = propagationResult.updatedFields.length > 0 
            ? `: ${propagationResult.updatedFields.join(', ')}` 
            : '';
            
          console.log(`Propagated changes to ${propagationResult.updatedCount} courses${fieldsList}`);
        }
      } catch (propagateError) {
        console.error("Exception during propagation:", propagateError);
        // Show warning but don't fail the whole operation
        toast.error("Warning: Template updated but propagation to courses failed");
      }
    }
    
    // Prepare success message based on propagation status
    const successMessage = courseData.isTemplate 
      ? propagateChanges && propagationResult.updatedCount > 0
        ? `Template updated and ${propagationResult.updatedCount} course(s) updated`
        : "Template updated successfully"
      : "Course updated successfully";
      
    toast.success(successMessage);
    
    return mapDbToCourse(data);
  } catch (err) {
    console.error("Exception in updateCourse:", err);
    handleMutationError(err, "Failed to update course");
    return null;
  }
};
