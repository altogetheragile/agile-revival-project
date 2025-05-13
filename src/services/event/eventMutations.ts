
// This file is deprecated - all functionality should be moved to courseService.ts
// This file remains for backward compatibility but all code is commented out

/*
import { Event, EventFormData, ScheduleEventFormData } from "@/types/event";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { mapDbToEvent, mapEventToDb } from "./eventMappers";
import { checkDatabaseHealth } from "@/utils/supabase/connection";
import { executeWithTimeout } from "@/utils/supabase/controllers";
*/

// Re-export functionality from courseService.ts for backwards compatibility
export { createCourse as createEvent } from "../courseService";
export { updateCourse as updateEvent } from "../courseService";
export { deleteCourse as deleteEvent } from "../courseService";
export { createCourseFromTemplate as createEventFromTemplate } from "../courseService";
