
import { Course } from "@/types/course";

export const initialCourses: Course[] = [
  {
    id: "crs-001",
    title: "Professional Scrum Master I",
    description: "Learn how to be an effective Scrum Master and servant-leader for your team. Understand the Scrum framework and how to apply it successfully.",
    dates: "May 15-16, 2025",
    location: "San Francisco, CA",
    instructor: "Sarah Johnson",
    price: "$1,195",
    category: "scrum",
    spotsAvailable: 8,
    format: "in-person",
    status: "published",
    materials: [],
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
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
    spotsAvailable: 12,
    format: "online",
    status: "published",
    materials: [],
    imageUrl: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=1000&auto=format&fit=crop"
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
    spotsAvailable: 10,
    format: "in-person",
    status: "published",
    materials: [],
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1000&auto=format&fit=crop"
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
    spotsAvailable: 6,
    format: "hybrid",
    status: "published",
    materials: [],
    imageUrl: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1000&auto=format&fit=crop"
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
    spotsAvailable: 15,
    format: "live",
    status: "published",
    materials: [],
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
  }
];
