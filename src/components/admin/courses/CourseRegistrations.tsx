
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseRegistrationsTable } from "./CourseRegistrationsTable";
import { RegistrationsSummary } from "./RegistrationsSummary";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseRegistrationsProps {
  course: Course;
  onBack: () => void;
}

const CourseRegistrations: React.FC<CourseRegistrationsProps> = ({ course, onBack }) => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        
        // Create a deterministic UUID from a course ID string using a consistent method
        const courseUuid = generateCourseUuid(course.id);
        console.log("Querying for course_id:", courseUuid);
        
        const { data, error } = await supabase
          .from('course_registrations')
          .select('*')
          .eq('course_id', courseUuid);
          
        if (error) {
          throw error;
        }
        
        setRegistrations(data || []);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        toast({
          title: "Error fetching registrations",
          description: "There was a problem retrieving the registration data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
  }, [course.id, toast]);

  // Function to generate a consistent UUID from a course ID string
  // Uses a deterministic approach to ensure consistent IDs
  const generateCourseUuid = (courseId: string): string => {
    // If the courseId is already a valid UUID, return it
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId)) {
      return courseId;
    }
    
    // For non-UUID course IDs, create a deterministic UUID
    // This uses a simple approach - in production, you might want a more sophisticated method
    // that generates the same UUID for the same string every time
    return `00000000-0000-0000-0000-${courseId.padStart(12, '0').slice(-12)}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <h2 className="text-xl font-semibold">
          Registrations for {course.title}
        </h2>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading registrations...</p>
      ) : (
        <>
          <RegistrationsSummary 
            registrations={registrations} 
            spotsAvailable={course.spotsAvailable} 
          />
          <CourseRegistrationsTable registrations={registrations} />
        </>
      )}
    </div>
  );
};

export default CourseRegistrations;
