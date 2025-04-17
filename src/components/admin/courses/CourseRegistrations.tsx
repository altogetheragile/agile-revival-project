
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
        
        const courseId = course.id;
        console.log("Fetching registrations for course_id:", courseId);
        
        // Using text-based course ID
        const { data, error } = await supabase
          .from('course_registrations')
          .select('*')
          .eq('course_id', courseId);
          
        if (error) {
          throw error;
        }
        
        console.log("Registration data fetched:", data);
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
