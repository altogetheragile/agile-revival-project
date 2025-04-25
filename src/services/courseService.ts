
export { 
  getAllCourses,
  getCoursesByCategory,
  getCourseById,
  getScheduledCourses,
  getCourseTemplates
} from './course/courseQueries';

export {
  createCourse,
  updateCourse,
  deleteCourse
} from './course/courseMutations';

export { addCourseMaterial, removeCourseMaterial } from './courseMaterialService';
export { 
  getCoursesByTemplateId,
  createCourseFromTemplate 
} from './templates';

