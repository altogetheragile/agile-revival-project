
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types/course";
import { checkCourseAvailability } from "@/utils/courseUtils";
import OrganizationInfoForm from "./group-registration/OrganizationInfoForm";
import MultipleParticipantsForm from "./group-registration/MultipleParticipantsForm";
import RegistrationAlerts from "./group-registration/RegistrationAlerts";
import { 
  groupRegistrationSchema, 
  GroupRegistrationFormValues 
} from "./group-registration/types";
import { submitGroupRegistration } from "./group-registration/groupRegistrationService";
import { useContactInfo } from "@/hooks/useContactInfo";

interface GroupRegistrationFormProps {
  course: Course;
  onComplete: () => void;
}

const GroupRegistrationForm: React.FC<GroupRegistrationFormProps> = ({ course, onComplete }) => {
  const { toast } = useToast();
  const { email: contactEmail } = useContactInfo();
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [courseAvailability, setCourseAvailability] = useState<{
    isFull: boolean;
    spotsLeft: number;
  }>({ isFull: false, spotsLeft: course.spotsAvailable });

  const form = useForm<GroupRegistrationFormValues>({
    resolver: zodResolver(groupRegistrationSchema),
    defaultValues: {
      organizationName: "",
      contactPerson: {
        firstName: "",
        lastName: "",
        email: ""
      },
      contactPhone: "",
      additionalNotes: "",
      participants: [
        {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
        }
      ],
    },
  });

  // Check course availability when component mounts
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const courseId = String(course.id);
        const availability = await checkCourseAvailability(courseId, course.spotsAvailable);
        setCourseAvailability({
          isFull: availability.isFull,
          spotsLeft: availability.spotsLeft
        });
      } catch (error) {
        console.error("Error checking course availability:", error);
      }
    };
    
    checkAvailability();
  }, [course.id, course.spotsAvailable]);

  const onSubmit = async (values: GroupRegistrationFormValues) => {
    try {
      setSubmitting(true);
      
      // Add the site contact email to the submission
      const enrichedValues = {
        ...values,
        siteContactEmail: contactEmail
      };
      
      const result = await submitGroupRegistration(enrichedValues, course);
      
      setRegistrationSuccess(true);
      
      // Show success toast
      toast({
        title: "Group registration successful!",
        description: `You've successfully registered ${result.participantCount} participants for ${course.title}.`,
        variant: "default",
      });
      
      // Close the form after a short delay
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Display success or error alerts
  if (registrationSuccess || courseAvailability.isFull) {
    return (
      <RegistrationAlerts 
        course={course}
        registrationSuccess={registrationSuccess}
        isFull={courseAvailability.isFull}
        spotsLeft={courseAvailability.spotsLeft}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RegistrationAlerts 
          course={course}
          registrationSuccess={registrationSuccess}
          isFull={courseAvailability.isFull}
          spotsLeft={courseAvailability.spotsLeft}
        />
        
        <OrganizationInfoForm form={form} />
        
        <MultipleParticipantsForm form={form} />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onComplete}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Complete Group Registration"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GroupRegistrationForm;
