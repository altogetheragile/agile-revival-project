
export { 
  getAllCourses,
  getCoursesByCategory,
  getCourseById
} from './course/courseQueries';

export {
  createCourse,
  updateCourse,
  deleteCourse
} from './course/courseMutations';

export { addCourseMaterial, removeCourseMaterial } from './courseMaterialService';
export { 
  getCourseTemplates,
  getCoursesByTemplateId,
  createCourseFromTemplate 
} from './courseTemplateService';
