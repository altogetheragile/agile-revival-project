
export type CourseFormat = {
  id?: string;
  value: string;
  label: string;
};

export const defaultFormats: CourseFormat[] = [
  { value: "in-person", label: "In-Person" },
  { value: "online", label: "Online" },
  { value: "live", label: "Live Virtual" },
  { value: "hybrid", label: "Hybrid" }
];
