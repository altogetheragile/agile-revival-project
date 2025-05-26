
import { supabase } from "@/integrations/supabase/client";
import { Course, CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { mapDbToCourse, mapCourseToDb } from "../courseMappers";
import { executeQuery } from "@/utils/supabase/query";
import { getAuthenticatedUser, checkAdminRole, handleMutationError } from "./baseCourseMutation";

export const createCourse = async (courseData: CourseFormData): Promise<Course | null> => {
  try {
    console.log("=== createCourse DEBUG START ===");
    console.log("Creating course with data:", courseData);
    console.log("courseData.isTemplate:", courseData.isTemplate);
    console.log("courseData.isTemplate type:", typeof courseData.isTemplate);
    
    // Check if user is authenticated
    const user = await getAuthenticatedUser();
    if (!user) return null;
    
    // If this is a template, verify admin role
    if (courseData.isTemplate && !(await checkAdminRole(user.id))) {
      return null;
    }

    console.log("About to call mapCourseToDb...");
    const dbCourseData = mapCourseToDb(courseData);
    console.log("mapCourseToDb returned:", dbCourseData);
    console.log("dbCourseData.is_template:", dbCourseData.is_template);
    
    const newCourse = {
      ...dbCourseData,
      created_by: user.id
    };
    
    console.log("Creating course with data:", newCourse);
    console.log("Final is_template value:", newCourse.is_template);
    
    // Ensure required fields for templates
    if (newCourse.is_template) {
      // Ensure template required fields have defaults
      newCourse.dates = newCourse.dates || "Template - No Dates";
      newCourse.location = newCourse.location || "To Be Determined";
      newCourse.instructor = newCourse.instructor || "To Be Assigned";
      newCourse.spots_available = newCourse.spots_available || 0;
      console.log("Template defaults applied, final is_template:", newCourse.is_template);
    }

    // Log the complete object being sent to the database
    console.log("Full course object being sent to database:", JSON.stringify(newCourse, null, 2));
    
    // Double-check the is_template field before database insert
    if (courseData.isTemplate && !newCourse.is_template) {
      console.error("CRITICAL: Template flag lost before database insert!");
      console.error("Original courseData.isTemplate:", courseData.isTemplate);
      console.error("Final newCourse.is_template:", newCourse.is_template);
      throw new Error("Template flag validation failed before database insert");
    }
    
    // Use executeQuery helper with proper timeouts and retries
    const { data, error } = await executeQuery<any>(
      async () => await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single(),
      {
        timeoutMs: 30000, // Increased timeout for course operations
        showErrorToast: true,
        errorMessage: "Failed to create course",
        retries: 2
      }
    );
      
    if (error) {
      console.error("Database insert error:", error);
      handleMutationError(error, "Failed to create course");
      return null;
    }
    
    console.log("Database insert successful, returned data:", data);
    console.log("Returned data.is_template:", data.is_template);
    
    toast.success(newCourse.is_template ? "Template created successfully" : "Course created successfully");
    
    const mappedCourse = mapDbToCourse(data);
    console.log("Final mapped course:", mappedCourse);
    console.log("Final mapped course.isTemplate:", mappedCourse.isTemplate);
    console.log("=== createCourse DEBUG END ===");
    
    return mappedCourse;
  } catch (err) {
    console.error("createCourse error:", err);
    handleMutationError(err, "Failed to create course");
    return null;
  }
};
