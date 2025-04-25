
import { Course, CourseFormData } from "@/types/course";

// Map from database fields to Course type
export const mapDbToCourse = (dbCourse: any): Course => {
  console.log("Mapping DB course to frontend:", dbCourse);
  
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    dates: dbCourse.dates,
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
  };
};

// Map from Course type to database fields
export const mapCourseToDb = (courseData: CourseFormData) => {
  console.log("Mapping frontend course to DB:", courseData);
  
  // Convert learning outcomes to array if it's a string
  let learningOutcomes = courseData.learningOutcomes;
  if (typeof learningOutcomes === 'string') {
    learningOutcomes = learningOutcomes.split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  // Create the DB object with all fields properly mapped
  const dbObject = {
    title: courseData.title || "",
    description: courseData.description || "",
    dates: courseData.dates || "",
    location: courseData.location || "",
    instructor: courseData.instructor || "",
    price: courseData.price || "",
    category: courseData.category || "",
    spots_available: courseData.spotsAvailable || 0,
    status: courseData.status || "draft",
    is_template: courseData.isTemplate === true ? true : false,
    learning_outcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [],
    prerequisites: courseData.prerequisites || null,
    target_audience: courseData.targetAudience || null,
    duration: courseData.duration || null,
    skill_level: courseData.skillLevel || null,
    format: courseData.format || "in-person",
    google_drive_folder_id: courseData.googleDriveFolderId || null,
    google_drive_folder_url: courseData.googleDriveFolderUrl || null,
    template_id: courseData.templateId || null,
    image_url: courseData.imageUrl || null,
    image_aspect_ratio: courseData.imageAspectRatio || "16/9",
    image_size: courseData.imageSize !== undefined ? courseData.imageSize : 100,
    image_layout: courseData.imageLayout || "standard"
  };

  console.log("Final DB object:", dbObject);
  return dbObject;
};
