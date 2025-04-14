
export interface Course {
  id: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  instructor: string;
  price: string;
  category: "scrum" | "kanban" | "leadership" | "all";
  spotsAvailable: number;
}

export type CourseFormData = Omit<Course, "id"> & {
  id?: string;
};
