
// Centralized categories configuration

export interface CourseCategoryConfig {
  value: string;
  label: string;
}

// Initial categories - these can all be deleted or modified by users through the site settings
export const COURSE_CATEGORIES: CourseCategoryConfig[] = [
  { value: "all", label: "All Courses" }, // Keep "all" as a special filter value
  { value: "Scrum", label: "Scrum" },     // Capitalized to match database
  { value: "Kanban", label: "Kanban" },   // Capitalized to match database
  { value: "Leadership", label: "Leadership" }, // Capitalized to match database
];

// For type inference of just category values
export const CATEGORY_VALUES = COURSE_CATEGORIES.map(cat => cat.value);
