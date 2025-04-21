
// Centralized categories configuration

export interface CourseCategoryConfig {
  value: string;
  label: string;
}

// Initial categories - these can all be deleted or modified by users through the site settings
export const COURSE_CATEGORIES: CourseCategoryConfig[] = [
  { value: "all", label: "All Courses" }, // Keep "all" as a special filter value
  { value: "scrum", label: "Scrum" },
  { value: "kanban", label: "Kanban" },
  { value: "leadership", label: "Leadership" },
];

// For type inference of just category values
export const CATEGORY_VALUES = COURSE_CATEGORIES.map(cat => cat.value);
