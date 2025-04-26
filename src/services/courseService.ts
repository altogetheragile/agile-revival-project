
import { createCourse, updateCourse, deleteCourse } from './course/courseMutations';
import { 
  getAllCourses,
  getCoursesByCategory,
  getCourseById,
  getScheduledCourses,
  getCourseTemplates
} from './course/courseQueries';

import { addCourseMaterial, removeCourseMaterial } from './courseMaterialService';
import { 
  getCoursesByTemplateId,
  createCourseFromTemplate 
} from './templates';

// Re-export all course-related functionality
export { 
  // Course queries
  getAllCourses,
  getCoursesByCategory,
  getCourseById,
  getScheduledCourses,
  getCourseTemplates,
  
  // Course mutations
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Course material operations
  addCourseMaterial, 
  removeCourseMaterial,
  
  // Template-related operations
  getCoursesByTemplateId,
  createCourseFromTemplate 
};
