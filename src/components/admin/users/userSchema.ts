
import * as z from "zod";

// Form schema for user form
export const userFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "user", "editor"]),
  status: z.enum(["active", "inactive", "pending"])
});

export type UserFormValues = z.infer<typeof userFormSchema>;
