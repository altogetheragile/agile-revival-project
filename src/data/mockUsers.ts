
import { User } from "@/types/user";

// Mock data for users - no longer used directly, as we're now using Supabase
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    createdAt: "2023-04-12",
    status: "active"
  },
  {
    id: "2",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    createdAt: "2023-05-20",
    status: "active"
  },
  {
    id: "3",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    role: "editor",
    createdAt: "2023-06-15",
    status: "inactive"
  },
  {
    id: "4",
    email: "mark.johnson@example.com",
    firstName: "Mark",
    lastName: "Johnson",
    role: "user",
    createdAt: "2023-07-01",
    status: "pending"
  },
  {
    id: "5",
    email: "sarah.williams@example.com",
    firstName: "Sarah",
    lastName: "Williams",
    role: "editor",
    createdAt: "2023-07-10",
    status: "active"
  },
];
