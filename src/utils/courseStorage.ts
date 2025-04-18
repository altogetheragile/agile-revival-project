
import { Course } from "@/types/course";
import { initialCourses } from "@/data/initialCourses";

const COURSES_STORAGE_KEY = 'agile-trainer-courses';

export const loadCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
  return storedCourses ? JSON.parse(storedCourses) : [...initialCourses];
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
};
