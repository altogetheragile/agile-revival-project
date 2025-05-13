
// This file is deprecated - all functionality should be moved to courseService.ts
// This file remains for backward compatibility but all code is commented out

/*
import { Event } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent } from "./eventMappers";
import { executeQuery } from "@/utils/supabase/query";

// All functionality has been moved to courseService.ts
// The events table does not exist in the database schema
*/

// Re-export functionality from courseService.ts for backwards compatibility
export { getAllCourses as getAllEvents } from "../courseService";
export { getCourseById as getEventById } from "../courseService";
