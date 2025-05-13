
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
    location: dbCourse.location,
    instructor: dbCourse.instructor,
    price: dbCourse.price,
    eventType: dbCourse.event_type || "course", // Map the event_type field
    category: dbCourse.category,
    spotsAvailable: dbCourse.spots_available,
    learningOutcomes: dbCourse.learning_outcomes || [],
    prerequisites: dbCourse.prerequisites || "",
    targetAudience: dbCourse.target_audience || "",
    duration: dbCourse.duration || "",
    skillLevel: dbCourse.skill_level || "all-levels",
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
    materials: dbCourse.materials || []
  };
};

// Map frontend Course type to database course object
export const mapCourseToDb = (course: CourseFormData): any => {
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

  return {
    title: course.title,
    description: course.description,
    dates: course.dates,
    location: course.location,
    instructor: course.instructor,
    price: course.price,
    event_type: course.eventType || "course", // Map the eventType field to event_type
    category: course.category,
    spots_available: Number(course.spotsAvailable),
    learning_outcomes: processedLearningOutcomes,
    prerequisites: course.prerequisites,
    target_audience: course.targetAudience,
    duration: course.duration,
    skill_level: course.skillLevel,
    format: course.format,
    status: status,
    google_drive_folder_id: course.googleDriveFolderId,
    google_drive_folder_url: course.googleDriveFolderUrl,
    is_template: course.isTemplate || false,
    template_id: course.templateId,
    image_url: course.imageUrl,
    image_aspect_ratio: course.imageAspectRatio || "16/9",
    image_size: course.imageSize || 100,
    image_layout: course.imageLayout || "standard"
  };
};
