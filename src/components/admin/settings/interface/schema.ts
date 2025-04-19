
import { z } from "zod";

export const interfaceFormSchema = z.object({
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  homepageLayout: z.string(),
  navigationStyle: z.string(),
});

export type InterfaceFormValues = z.infer<typeof interfaceFormSchema>;
