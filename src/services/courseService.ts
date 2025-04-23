
import { Course, CourseFormData } from "@/types/course";
import { loadCourses, saveCourses } from "@/utils/courseStorage";
import { applyImageSettings } from "./courseImageService";

// Get all courses
export const getAllCourses = (): Course[] => {
  return loadCourses();
};

// Get courses by category
export const getCoursesByCategory = (category: string): Course[] => {
  const courses = loadCourses();
  // Only return non-template courses for the public view
  const nonTemplates = courses.filter(course => !course.isTemplate);
  return category === 'all' ? nonTemplates : nonTemplates.filter(course => course.category === category);
};

// Get a course by ID
export const getCourseById = (id: string): Course | undefined => {
  const courses = loadCourses();
  return courses.find(course => course.id === id);
};

// Get all scheduled (non-template) courses
export const getScheduledCourses = (): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => !course.isTemplate && (course.status === 'published' || course.status === 'draft'));
};

// Get published courses only
export const getPublishedCourses = (): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => course.status === 'published' && !course.isTemplate);
};

// Create a new course
export const createCourse = (courseData: CourseFormData): Course => {
  const courses = loadCourses();
  const newId = `crs-${String(Date.now()).slice(-6)}`;
  
  // Create the new course with image settings
  const newCourse: Course = {
    id: newId,
    title: courseData.title || "",
    description: courseData.description || "",
    dates: courseData.dates || "",
    location: courseData.location || "",
    instructor: courseData.instructor || "",
    price: courseData.price || "",
    category: courseData.category || "",
    spotsAvailable: courseData.spotsAvailable || 0,
    status: courseData.status,
    isTemplate: courseData.isTemplate || false,
    materials: [],
    learningOutcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : [],
    prerequisites: courseData.prerequisites,
    targetAudience: courseData.targetAudience,
    duration: courseData.duration,
    skillLevel: courseData.skillLevel,
    format: courseData.format,
    googleDriveFolderId: courseData.googleDriveFolderId,
    googleDriveFolderUrl: courseData.googleDriveFolderUrl,
    templateId: courseData.templateId,
    ...applyImageSettings({}, courseData)
  };
  
  courses.push(newCourse);
  saveCourses(courses);
  
  return newCourse;
};

// Update an existing course
export const updateCourse = (id: string, courseData: CourseFormData): Course | null => {
  const courses = loadCourses();
  const index = courses.findIndex(course => course.id === id);
  
  if (index === -1) {
    console.error("Failed to update course: Course not found with ID", id);
    return null;
  }
  
  const existingCourse = courses[index];
  const existingMaterials = existingCourse.materials || [];
  
  // Create updated course with explicit image property handling
  const updatedCourse: Course = {
    ...existingCourse,
    title: courseData.title !== undefined ? courseData.title : existingCourse.title,
    description: courseData.description !== undefined ? courseData.description : existingCourse.description,
    dates: courseData.dates !== undefined ? courseData.dates : existingCourse.dates,
    location: courseData.location !== undefined ? courseData.location : existingCourse.location,
    instructor: courseData.instructor !== undefined ? courseData.instructor : existingCourse.instructor,
    price: courseData.price !== undefined ? courseData.price : existingCourse.price,
    category: courseData.category !== undefined ? courseData.category : existingCourse.category,
    spotsAvailable: courseData.spotsAvailable !== undefined ? courseData.spotsAvailable : existingCourse.spotsAvailable,
    status: courseData.status !== undefined ? courseData.status : existingCourse.status,
    isTemplate: courseData.isTemplate !== undefined ? courseData.isTemplate : existingCourse.isTemplate,
    materials: existingMaterials,
    learningOutcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : existingCourse.learningOutcomes,
    prerequisites: courseData.prerequisites !== undefined ? courseData.prerequisites : existingCourse.prerequisites,
    targetAudience: courseData.targetAudience !== undefined ? courseData.targetAudience : existingCourse.targetAudience,
    duration: courseData.duration !== undefined ? courseData.duration : existingCourse.duration,
    skillLevel: courseData.skillLevel !== undefined ? courseData.skillLevel : existingCourse.skillLevel,
    format: courseData.format !== undefined ? courseData.format : existingCourse.format,
    googleDriveFolderId: courseData.googleDriveFolderId !== undefined ? courseData.googleDriveFolderId : existingCourse.googleDriveFolderId,
    googleDriveFolderUrl: courseData.googleDriveFolderUrl !== undefined ? courseData.googleDriveFolderUrl : existingCourse.googleDriveFolderUrl,
    templateId: courseData.templateId !== undefined ? courseData.templateId : existingCourse.templateId,
    ...applyImageSettings(existingCourse, courseData)
  };
  
  courses[index] = updatedCourse;
  saveCourses(courses);
  
  return updatedCourse;
};

// Delete a course
export const deleteCourse = (id: string): boolean => {
  const courses = loadCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  
  if (filteredCourses.length === courses.length) {
    return false;
  }
  
  saveCourses(filteredCourses);
  return true;
};

// Re-export course material operations
export { addCourseMaterial, removeCourseMaterial } from './courseMaterialService';

// Re-export template operations
export { 
  getCourseTemplates,
  getCoursesByTemplateId,
  createCourseFromTemplate 
} from './courseTemplateService';
