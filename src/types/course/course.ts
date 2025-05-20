
// Re-export from the main course types file
export * from '../course';

// Add comprehensive documentation for the courses table
/**
 * The courses table in this system is designed to handle multiple event types
 * within a single unified structure. This allows for flexibility in managing 
 * different types of events (courses, workshops, webinars, etc.) while 
 * maintaining consistent workflows.
 * 
 * Key fields:
 * - event_type: Stores the type of event (course, workshop, webinar, etc.)
 * - event_type_id: References the event_types table for consistent categorization
 * - is_template: Boolean flag indicating if this is a template to create events from
 * - template_id: For non-templates, references the template it was created from
 * - deleted_at: Timestamp for soft deletion, null for active records
 * 
 * Templates vs Events:
 * - Templates (is_template = true): Used as blueprints to create multiple events
 * - Events (is_template = false): Actual scheduled instances created from templates
 * 
 * Template management is centralized in Settings > Templates, while event instances
 * are managed in the Events tab of the admin dashboard.
 */

