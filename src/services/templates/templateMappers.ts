
import { Course } from "@/types/course";

export const mapDbToCourse = (dbCourse: any): Course => ({
  id: dbCourse.id,
  title: dbCourse.title,
  description: dbCourse.description,
  dates: dbCourse.dates,
  startDate: dbCourse.start_date || null,
  endDate: dbCourse.end_date || null,
  location: dbCourse.location,
  instructor: dbCourse.instructor,
  price: dbCourse.price,
  category: dbCourse.category,
  spotsAvailable: dbCourse.spots_available,
  learningOutcomes: dbCourse.learning_outcomes,
  prerequisites: dbCourse.prerequisites,
  targetAudience: dbCourse.target_audience,
  duration: dbCourse.duration,
  skillLevel: dbCourse.skill_level,
  format: dbCourse.format,
  status: dbCourse.status,
  materials: dbCourse.materials || [],
  googleDriveFolderId: dbCourse.google_drive_folder_id,
  googleDriveFolderUrl: dbCourse.google_drive_folder_url,
  isTemplate: dbCourse.is_template,
  templateId: dbCourse.template_id,
  imageUrl: dbCourse.image_url,
  imageAspectRatio: dbCourse.image_aspect_ratio,
  imageSize: dbCourse.image_size,
  imageLayout: dbCourse.image_layout,
  eventType: dbCourse.event_type || "course", // Add default event type
});
