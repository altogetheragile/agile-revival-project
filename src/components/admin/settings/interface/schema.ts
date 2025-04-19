
import { z } from "zod";

export const interfaceFormSchema = z.object({
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
  homepageLayout: z.string(),
  navigationStyle: z.string(),
});

export type InterfaceFormValues = z.infer<typeof interfaceFormSchema>;
