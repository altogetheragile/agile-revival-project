
import { z } from "zod";

// Schema for a single participant
export const participantSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  // Make phone a required field with a reasonable validation
  phone: z.string().min(1, "Phone number is required"),
});

// Schema for group registration form
export const groupRegistrationSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  contactPerson: participantSchema.omit({ phone: true }),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  additionalNotes: z.string().optional(),
  participants: z.array(participantSchema).min(1, "At least one participant is required"),
});

export type GroupRegistrationFormValues = z.infer<typeof groupRegistrationSchema>;
