
// Centralized categories configuration

export interface CourseCategoryConfig {
  value: string; // Changed from string literal union type to accept any string
  label: string;
}

export const COURSE_CATEGORIES: CourseCategoryConfig[] = [
  { value: "all", label: "All Courses" },
  { value: "scrum", label: "Scrum" },
  { value: "kanban", label: "Kanban" },
  { value: "leadership", label: "Leadership" },
];

// For type inference of just category values (excluding 'all' if ever needed)
export const CATEGORY_VALUES = COURSE_CATEGORIES.map(cat => cat.value);
