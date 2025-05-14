
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
  // Filter out undefined fields
  const changedKeys = Object.keys(updatedFields)
    .filter(key => updatedFields[key as keyof UpdateableCourseFields] !== undefined);
  
  // Remove undefined fields to avoid overwriting with nulls
  const cleanFields = Object.fromEntries(
    Object.entries(updatedFields).filter(([_, value]) => value !== undefined)
  );
  
  console.log("Updating courses from template", { 
    templateId, 
    changedKeys,
    cleanFields
  });
  
  // Exit early if no fields to update
  if (changedKeys.length === 0) {
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
      return { success: false, error: fetchError.message, updatedFields: [], updatedCount: 0 };
    }
    
    if (!courses || courses.length === 0) {
      console.log("No courses found derived from template", templateId);
      return { success: true, updatedFields: changedKeys, updatedCount: 0 };
    }
    
    console.log(`Found ${courses.length} courses to update from template ${templateId}`);
    
    // Update each course (more reliable than batch update with proper error handling)
    let updatedCount = 0;
    
    for (const course of courses) {
      const { error: updateError } = await supabase
        .from('courses')
        .update(cleanFields)
        .eq('id', course.id);
        
      if (updateError) {
        console.error(`Error updating course ${course.id}:`, updateError);
      } else {
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} courses with fields: ${changedKeys.join(', ')}`);
    return { success: true, updatedFields: changedKeys, updatedCount };
  } catch (err) {
    console.error("Error in updateCoursesFromTemplate:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: errorMessage, updatedFields: [], updatedCount: 0 };
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
