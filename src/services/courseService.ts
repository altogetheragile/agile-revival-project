
import { Course, CourseFormData } from "@/types/course";
import { loadCourses, saveCourses } from "@/utils/courseStorage";

// Get all courses
export const getAllCourses = (): Course[] => {
  return loadCourses();
};

// Get courses by category
export const getCoursesByCategory = (category: string): Course[] => {
  const courses = loadCourses();
  return category === 'all' ? courses : courses.filter(course => course.category === category);
};

// Get a course by ID
export const getCourseById = (id: string): Course | undefined => {
  const courses = loadCourses();
  return courses.find(course => course.id === id);
};

// Get published courses only
export const getPublishedCourses = (): Course[] => {
  const courses = loadCourses();
  return courses.filter(course => course.status === 'published');
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

// Create a new course
export const createCourse = (courseData: CourseFormData): Course => {
  const courses = loadCourses();
  
  const newId = `crs-${String(Date.now()).slice(-6)}`;
  
  const newCourse: Course = {
    ...courseData,
    id: newId,
    materials: [],
    learningOutcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : []
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
    return null;
  }
  
  const existingMaterials = courses[index].materials || [];
  
  const updatedCourse: Course = {
    ...courses[index],
    ...courseData,
    id,
    materials: existingMaterials,
    learningOutcomes: Array.isArray(courseData.learningOutcomes) 
      ? courseData.learningOutcomes 
      : courseData.learningOutcomes ? [courseData.learningOutcomes] : courses[index].learningOutcomes,
    googleDriveFolderId: courseData.googleDriveFolderId || courses[index].googleDriveFolderId,
    googleDriveFolderUrl: courseData.googleDriveFolderUrl || courses[index].googleDriveFolderUrl
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
