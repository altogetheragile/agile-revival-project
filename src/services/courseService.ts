
import { Course, CourseFormData } from "@/types/course";

// Initial course data
const initialCourses: Course[] = [
  {
    id: "crs-001",
    title: "Professional Scrum Master I",
    description: "Learn how to be an effective Scrum Master and servant-leader for your team. Understand the Scrum framework and how to apply it successfully.",
    dates: "May 15-16, 2025",
    location: "San Francisco, CA",
    instructor: "Sarah Johnson",
    price: "$1,195",
    category: "scrum",
    spotsAvailable: 8
  },
  {
    id: "crs-002",
    title: "Advanced Product Ownership",
    description: "Deep-dive into the role of a Product Owner. Master techniques for backlog management, value maximization, and stakeholder management.",
    dates: "May 22-23, 2025",
    location: "Online - Virtual Classroom",
    instructor: "Michael Chen",
    price: "$1,295",
    category: "scrum",
    spotsAvailable: 12
  },
  {
    id: "crs-003",
    title: "Kanban System Design",
    description: "Learn how to design and implement effective Kanban systems that improve flow and delivery predictability for your teams.",
    dates: "June 5-6, 2025",
    location: "Chicago, IL",
    instructor: "Emily Rodriguez",
    price: "$1,195",
    category: "kanban",
    spotsAvailable: 10
  },
  {
    id: "crs-004",
    title: "Agile Leadership Foundations",
    description: "For managers and executives, learn how to lead and support agile transformations in your organization.",
    dates: "June 12-13, 2025",
    location: "Atlanta, GA",
    instructor: "David Washington",
    price: "$1,495",
    category: "leadership",
    spotsAvailable: 6
  },
  {
    id: "crs-005",
    title: "Team Facilitation Masterclass",
    description: "Enhance your facilitation skills to run more effective and engaging meetings and workshops with agile teams.",
    dates: "June 19-20, 2025",
    location: "Online - Virtual Classroom",
    instructor: "Lisa Park",
    price: "$995",
    category: "leadership",
    spotsAvailable: 15
  }
];

// Storage key for courses
const COURSES_STORAGE_KEY = 'agile-trainer-courses';

// Load courses from localStorage or use initial data
const loadCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
  return storedCourses ? JSON.parse(storedCourses) : [...initialCourses];
};

// Save courses to localStorage
const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
};

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

// Create a new course
export const createCourse = (courseData: CourseFormData): Course => {
  const courses = loadCourses();
  
  // Generate a unique ID
  const newId = `crs-${String(Date.now()).slice(-6)}`;
  
  const newCourse: Course = {
    ...courseData,
    id: newId
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
  
  const updatedCourse: Course = {
    ...courses[index],
    ...courseData,
    id // Ensure ID remains unchanged
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
    // No course was removed
    return false;
  }
  
  saveCourses(filteredCourses);
  return true;
};
