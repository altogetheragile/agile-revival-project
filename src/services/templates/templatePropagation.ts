
import { supabase } from "@/integrations/supabase/client";

// Define and export the interface for the return type
export interface TemplatePropagationResult {
  success: boolean;
  error?: string;
  updatedFields: string[];
  updatedCount: number;
}

export async function updateCoursesFromTemplate(
  templateId: string,
  updatedFields: Partial<UpdateableCourseFields>
): Promise<TemplatePropagationResult> {
  // Log the operation
  console.log("Starting updateCoursesFromTemplate for template:", templateId);
  
  // Filter out undefined fields
  const changedKeys = Object.keys(updatedFields)
    .filter(key => updatedFields[key as keyof UpdateableCourseFields] !== undefined);
  
  // Remove undefined fields to avoid overwriting with nulls
  const cleanFields = Object.fromEntries(
    Object.entries(updatedFields).filter(([_, value]) => value !== undefined)
  );
  
  console.log("Updating courses from template:", { 
    templateId, 
    changedKeys,
    cleanFields
  });
  
  // Exit early if no fields to update
  if (changedKeys.length === 0) {
    console.log("No fields to update for template", templateId);
    return { success: true, updatedFields: [], updatedCount: 0 };
  }

  try {
    // Get list of course IDs first (for better error handling)
    const { data: courses, error: fetchError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('template_id', templateId)
      .eq('is_template', false);
      
    if (fetchError) {
      console.error("Error fetching derived courses:", fetchError);
      return { 
        success: false, 
        error: `Failed to fetch courses derived from template: ${fetchError.message}`, 
        updatedFields: [], 
        updatedCount: 0 
      };
    }
    
    if (!courses || courses.length === 0) {
      console.log("No courses found derived from template", templateId);
      return { success: true, updatedFields: changedKeys, updatedCount: 0 };
    }
    
    console.log(`Found ${courses.length} courses to update from template ${templateId}`);
    console.log("Courses to update:", courses.map(c => ({id: c.id, title: c.title})));
    
    // Update each course (more reliable than batch update with proper error handling)
    let updatedCount = 0;
    let errors: string[] = [];
    
    for (const course of courses) {
      console.log(`Updating course ${course.id} (${course.title}) from template ${templateId}`);
      
      const { error: updateError } = await supabase
        .from('courses')
        .update(cleanFields)
        .eq('id', course.id);
        
      if (updateError) {
        console.error(`Error updating course ${course.id}:`, updateError);
        errors.push(`Failed to update course ${course.id}: ${updateError.message}`);
      } else {
        updatedCount++;
        console.log(`Successfully updated course ${course.id} (${course.title})`);
      }
    }

    const success = errors.length === 0;
    
    if (!success) {
      console.error("Some courses failed to update:", errors);
      return { 
        success: false, 
        error: errors.join("; "), 
        updatedFields: changedKeys, 
        updatedCount 
      };
    }

    console.log(`Successfully updated ${updatedCount} courses with fields: ${changedKeys.join(', ')}`);
    return { success: true, updatedFields: changedKeys, updatedCount };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error in updateCoursesFromTemplate:", err);
    return { 
      success: false, 
      error: errorMessage, 
      updatedFields: [], 
      updatedCount: 0 
    };
  }
}

// Typescript interface for updatable fields
export interface UpdateableCourseFields {
  title?: string;
  description?: string;
  category?: string;
  learning_outcomes?: string[];
  prerequisites?: string;
  target_audience?: string;
  duration?: string;
  skill_level?: string;
  format?: string;
  price?: string;
  event_type?: string;
  image_url?: string;
  image_aspect_ratio?: string;
  image_size?: number;
  image_layout?: string;
}
