
import { Course, CourseFormData } from "@/types/course";

// Map database course object to frontend Course type
export const mapDbToCourse = (dbCourse: any): Course => {
  // Ensure status is either "draft" or "published"
  const status = dbCourse.status === "published" ? "published" : "draft";

  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    dates: dbCourse.dates,
    startDate: dbCourse.start_date || null,
    endDate: dbCourse.end_date || null,
    location: dbCourse.location,
    instructor: dbCourse.instructor,
    price: dbCourse.price,
    eventType: dbCourse.event_type || "course", // Map the event_type field
    event_type_id: dbCourse.event_type_id,
    category: dbCourse.category,
    category_id: dbCourse.category_id,
    spotsAvailable: dbCourse.spots_available,
    learningOutcomes: dbCourse.learning_outcomes || [],
    prerequisites: dbCourse.prerequisites || "",
    targetAudience: dbCourse.target_audience || "",
    duration: dbCourse.duration || "",
    skillLevel: dbCourse.skill_level || "all-levels",
    skill_level_id: dbCourse.skill_level_id,
    format: dbCourse.format || "in-person",
    status: status,
    googleDriveFolderId: dbCourse.google_drive_folder_id,
    googleDriveFolderUrl: dbCourse.google_drive_folder_url,
    isTemplate: dbCourse.is_template || false,
    templateId: dbCourse.template_id,
    imageUrl: dbCourse.image_url,
    imageAspectRatio: dbCourse.image_aspect_ratio || "16/9",
    imageSize: dbCourse.image_size || 100,
    imageLayout: dbCourse.image_layout || "standard",
  };
};

// Map frontend Course type to database course object
export const mapCourseToDb = (course: CourseFormData): any => {
  console.log("=== mapCourseToDb DEBUG START ===");
  console.log("Input course data:", course);
  console.log("course.isTemplate value:", course.isTemplate);
  console.log("course.isTemplate type:", typeof course.isTemplate);
  console.log("course.isTemplate === true:", course.isTemplate === true);
  console.log("course.isTemplate === 'true':", course.isTemplate === 'true');
  console.log("Boolean(course.isTemplate):", Boolean(course.isTemplate));

  let processedLearningOutcomes = course.learningOutcomes;

  // Handle the case where learning outcomes are provided as a string (from form input)
  if (typeof course.learningOutcomes === 'string') {
    processedLearningOutcomes = course.learningOutcomes
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  // Ensure status is either "draft" or "published"
  const status = course.status === "published" ? "published" : "draft";

  // Explicitly ensure isTemplate is a boolean and handle edge cases
  let isTemplateValue = false;
  if (course.isTemplate === true || course.isTemplate === 'true' || course.isTemplate === 1) {
    isTemplateValue = true;
  }

  console.log("Final isTemplateValue:", isTemplateValue);

  const dbData = {
    title: course.title,
    description: course.description,
    dates: course.dates,
    start_date: course.startDate || null,
    end_date: course.endDate || null,
    location: course.location,
    instructor: course.instructor,
    price: course.price,
    event_type: course.eventType || "course", // Map the eventType field to event_type
    event_type_id: course.event_type_id || null,
    category: course.category,
    category_id: course.category_id || null,
    spots_available: Number(course.spotsAvailable),
    learning_outcomes: processedLearningOutcomes,
    prerequisites: course.prerequisites,
    target_audience: course.targetAudience,
    duration: course.duration,
    skill_level: course.skillLevel,
    skill_level_id: course.skill_level_id || null,
    format: course.format,
    status: status,
    google_drive_folder_id: course.googleDriveFolderId,
    google_drive_folder_url: course.googleDriveFolderUrl,
    is_template: isTemplateValue,
    template_id: course.templateId,
    image_url: course.imageUrl,
    image_aspect_ratio: course.imageAspectRatio || "16/9",
    image_size: course.imageSize || 100,
    image_layout: course.imageLayout || "standard"
  };

  console.log("Final dbData.is_template:", dbData.is_template);
  console.log("Final dbData object:", dbData);
  console.log("=== mapCourseToDb DEBUG END ===");

  // Add validation to catch templates being saved incorrectly
  if (course.isTemplate && !dbData.is_template) {
    console.error("CRITICAL ERROR: Template flag lost during mapping!");
    console.error("Original course.isTemplate:", course.isTemplate);
    console.error("Final dbData.is_template:", dbData.is_template);
    throw new Error("Template flag validation failed - template would be saved as regular course");
  }

  return dbData;
};
