import { Course, CourseFormData, ScheduleCourseFormData } from "@/types/course";
import { loadCourses, saveCourses, getGlobalCacheBust } from "@/utils/courseStorage";

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

// Get all scheduled (non-template) courses, regardless of status
export const getScheduledCourses = (): Course[] => {
  const courses = loadCourses();
  // Filter out templates and include all courses with status 'published' or 'draft'
  return courses.filter(course => !course.isTemplate && (course.status === 'published' || course.status === 'draft'));
};

// Get published courses only
export const getPublishedCourses = (): Course[] => {
  const courses = loadCourses();
  // Filter out templates and only include published courses
  return courses.filter(course => course.status === 'published' && !course.isTemplate);
};

// Get course templates
export const getCourseTemplates = (): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => course.isTemplate === true);
};

// Get courses by template ID
export const getCoursesByTemplateId = (templateId: string): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => course.templateId === templateId);
};

// Apply cache busting to image URL
const applyCacheBustToImage = (imageUrl: string | undefined): string => {
  if (!imageUrl) return "";
  
  // Strip any existing cache busting params
  const baseUrl = imageUrl.split('?')[0];
  // Apply new cache busting param
  const cacheBust = getGlobalCacheBust();
  return `${baseUrl}?v=${cacheBust}`;
};

// Create a new course
export const createCourse = (courseData: CourseFormData): Course => {
  const courses = loadCourses();
  
  const newId = `crs-${String(Date.now()).slice(-6)}`;
  
  // Apply cache busting to image URL
  const imageUrlWithCache = applyCacheBustToImage(courseData.imageUrl);
  
  console.log("Creating course with image settings:", {
    imageUrl: imageUrlWithCache,
    originalUrl: courseData.imageUrl,
    imageAspectRatio: courseData.imageAspectRatio,
    imageSize: courseData.imageSize,
    imageLayout: courseData.imageLayout
  });
  
  // Create the new course with explicit image properties
  const newCourse: Course = {
    // Basic course properties
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
    
    // Additional properties
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
    
    // Explicitly include ALL image settings with appropriate defaults
    imageUrl: imageUrlWithCache,
    imageAspectRatio: courseData.imageAspectRatio || "16/9",
    imageSize: courseData.imageSize === undefined ? 100 : courseData.imageSize,
    imageLayout: courseData.imageLayout || "standard"
  };
  
  courses.push(newCourse);
  saveCourses(courses);
  
  return newCourse;
};

// Create a course from a template
export const createCourseFromTemplate = (templateId: string, scheduleData: ScheduleCourseFormData): Course => {
  const courses = loadCourses();
  const template = courses.find(course => course.id === templateId);
  
  if (!template) {
    throw new Error("Template not found");
  }
  
  const newId = `crs-${String(Date.now()).slice(-6)}`;
  
  // Apply cache busting to image URL
  const imageUrlWithCache = applyCacheBustToImage(template.imageUrl);
  
  // Create a new course based on the template, but with scheduled details
  // Preserve image settings from template
  const newCourse: Course = {
    ...template,
    id: newId,
    dates: scheduleData.dates,
    location: scheduleData.location,
    instructor: scheduleData.instructor,
    spotsAvailable: scheduleData.spotsAvailable,
    status: scheduleData.status,
    isTemplate: false, // This is now a scheduled course, not a template
    templateId: templateId, // Reference back to the template it was created from
    materials: [],
    // Explicitly preserve image settings with cache busting
    imageUrl: imageUrlWithCache,
    imageAspectRatio: template.imageAspectRatio || "16/9",
    imageSize: template.imageSize || 100,
    imageLayout: template.imageLayout || "standard"
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
  
  // Apply cache busting to image URL if it has changed
  const imageUrlWithCache = courseData.imageUrl !== existingCourse.imageUrl ? 
    applyCacheBustToImage(courseData.imageUrl) : courseData.imageUrl;
  
  console.log("Updating course with image settings:", {
    original: {
      imageUrl: existingCourse.imageUrl,
      imageAspectRatio: existingCourse.imageAspectRatio,
      imageSize: existingCourse.imageSize,
      imageLayout: existingCourse.imageLayout
    },
    new: {
      imageUrl: imageUrlWithCache,
      originalUrl: courseData.imageUrl,
      imageAspectRatio: courseData.imageAspectRatio,
      imageSize: courseData.imageSize,
      imageLayout: courseData.imageLayout
    }
  });
  
  // Create updated course with explicit image property handling
  const updatedCourse: Course = {
    ...existingCourse,
    // Update basic course properties
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
    
    // Preserve and update additional properties
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
    
    // Explicitly handle image properties to prevent them from becoming undefined
    imageUrl: imageUrlWithCache || existingCourse.imageUrl || "",
    imageAspectRatio: courseData.imageAspectRatio || existingCourse.imageAspectRatio || "16/9",
    imageSize: courseData.imageSize !== undefined ? courseData.imageSize : (existingCourse.imageSize !== undefined ? existingCourse.imageSize : 100),
    imageLayout: courseData.imageLayout || existingCourse.imageLayout || "standard",
    
    // Preserve ID
    id: id
  };
  
  courses[index] = updatedCourse;
  saveCourses(courses);
  console.log("Course updated successfully with image settings:", {
    imageUrl: updatedCourse.imageUrl,
    imageAspectRatio: updatedCourse.imageAspectRatio,
    imageSize: updatedCourse.imageSize,
    imageLayout: updatedCourse.imageLayout
  });
  
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
