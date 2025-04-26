
// Re-export functionality from template services for consistency
export { getCourseTemplates, getCoursesByTemplateId } from './templateQueries';
export { createCourseFromTemplate } from './templateMutations';
export { fallbackTemplates } from './templateData';
export { mapDbToCourse } from './templateMappers';
