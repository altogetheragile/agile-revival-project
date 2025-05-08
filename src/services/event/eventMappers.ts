
import { Event, EventFormData } from "@/types/event";

// Map database event object to frontend Event type
export const mapDbToEvent = (dbEvent: any): Event => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    dates: dbEvent.dates,
    location: dbEvent.location,
    instructor: dbEvent.instructor,
    price: dbEvent.price,
    category: dbEvent.category,
    spotsAvailable: dbEvent.spots_available,
    learningOutcomes: dbEvent.learning_outcomes || [],
    prerequisites: dbEvent.prerequisites || "",
    targetAudience: dbEvent.target_audience || "",
    duration: dbEvent.duration || "",
    skillLevel: dbEvent.skill_level || "all-levels",
    format: dbEvent.format || "in-person",
    status: dbEvent.status || "draft",
    googleDriveFolderId: dbEvent.google_drive_folder_id,
    googleDriveFolderUrl: dbEvent.google_drive_folder_url,
    isTemplate: dbEvent.is_template || false,
    templateId: dbEvent.template_id,
    imageUrl: dbEvent.image_url,
    imageAspectRatio: dbEvent.image_aspect_ratio || "16/9",
    imageSize: dbEvent.image_size || 100,
    imageLayout: dbEvent.image_layout || "standard"
  };
};

// Map frontend Event type to database event object
export const mapEventToDb = (event: EventFormData): any => {
  let processedLearningOutcomes = event.learningOutcomes;

  // Handle the case where learning outcomes are provided as a string (from form input)
  if (typeof event.learningOutcomes === 'string') {
    processedLearningOutcomes = event.learningOutcomes
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  return {
    title: event.title,
    description: event.description,
    dates: event.dates,
    location: event.location,
    instructor: event.instructor,
    price: event.price,
    category: event.category,
    spots_available: Number(event.spotsAvailable),
    learning_outcomes: processedLearningOutcomes,
    prerequisites: event.prerequisites,
    target_audience: event.targetAudience,
    duration: event.duration,
    skill_level: event.skillLevel,
    format: event.format,
    status: event.status || 'draft',
    google_drive_folder_id: event.googleDriveFolderId,
    google_drive_folder_url: event.googleDriveFolderUrl,
    is_template: event.isTemplate || false,
    template_id: event.templateId,
    image_url: event.imageUrl,
    image_aspect_ratio: event.imageAspectRatio || "16/9",
    image_size: event.imageSize || 100,
    image_layout: event.imageLayout || "standard"
  };
};
