
import { Course, ScheduleCourseFormData } from "@/types/course";
import { loadCourses, saveCourses } from "@/utils/courseStorage";
import { applyCacheBustToImage } from "./courseImageService";

export const getCourseTemplates = (): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => course.isTemplate === true);
};

export const getCoursesByTemplateId = (templateId: string): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => course.templateId === templateId);
};

export const createCourseFromTemplate = (templateId: string, scheduleData: ScheduleCourseFormData): Course => {
  const courses = loadCourses();
  const template = courses.find(course => course.id === templateId);
  
  if (!template) {
    throw new Error("Template not found");
  }
  
  const newId = `crs-${String(Date.now()).slice(-6)}`;
  
  // Apply cache busting to image URL if it exists
  const imageUrlWithCache = template.imageUrl ? applyCacheBustToImage(template.imageUrl) : undefined;
  
  // Create a new course based on the template
  const newCourse: Course = {
    ...template,
    id: newId,
    dates: scheduleData.dates,
    location: scheduleData.location,
    instructor: scheduleData.instructor,
    spotsAvailable: scheduleData.spotsAvailable,
    status: scheduleData.status || 'draft',
    isTemplate: false,
    templateId: templateId,
    materials: [],
    imageUrl: imageUrlWithCache,
    imageAspectRatio: template.imageAspectRatio || "16/9",
    imageSize: template.imageSize || 100,
    imageLayout: template.imageLayout || "standard"
  };
  
  courses.push(newCourse);
  saveCourses(courses);
  
  return newCourse;
};
