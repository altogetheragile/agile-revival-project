
// This file is maintained for backward compatibility
// All functionality is now provided by courseService.ts

import { 
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getCoursesByCategory,
  getScheduledCourses,
  getCourseTemplates,
  createCourseFromTemplate
} from './courseService';

// Re-export all functionality from courseService
export {
  createCourse as createEvent,
  updateCourse as updateEvent,
  deleteCourse as deleteEvent,
  getAllCourses as getAllEvents,
  getCourseById as getEventById,
  getCoursesByCategory as getEventsByCategory,
  getScheduledCourses as getScheduledEvents,
  getCourseTemplates as getEventTemplates,
  createCourseFromTemplate as createEventFromTemplate
};
