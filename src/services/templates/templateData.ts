
import { Course } from "@/types/course";

export const fallbackTemplates: Course[] = [
  {
    id: "template-001",
    title: "Professional Scrum Master",
    description: "Learn the essentials of being a Professional Scrum Master",
    category: "Agile",
    format: "in-person",
    duration: "2 days",
    skillLevel: "intermediate",
    status: "published",
    isTemplate: true,
    price: "£995",
    spotsAvailable: 12,
    dates: "TBD",
    location: "London",
    instructor: "Alun Davies-Baker"
  },
  {
    id: "template-002",
    title: "Agile Product Owner",
    description: "Master the role of Product Owner in an agile environment",
    category: "Agile",
    format: "in-person",
    duration: "2 days",
    skillLevel: "intermediate",
    status: "published",
    isTemplate: true,
    price: "£995",
    spotsAvailable: 12,
    dates: "TBD",
    location: "London",
    instructor: "Alun Davies-Baker"
  }
];
