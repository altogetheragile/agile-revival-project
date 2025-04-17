
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types/course";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { checkCourseAvailability } from "@/utils/courseUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import MultipleParticipantsForm, { groupRegistrationSchema, GroupRegistrationFormValues } from "./MultipleParticipantsForm";

interface GroupRegistrationFormProps {
  course: Course;
  onComplete: () => void;
}

const GroupRegistrationForm: React.FC<GroupRegistrationFormProps> = ({ course, onComplete }) => {
  const { toast } = useToast();
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
      
      // Ensure we're using string format for course_id
      const courseId = String(course.id);
      
      // Check participant count doesn't exceed available spots
      const participantCount = values.participants.length;
      if (participantCount > courseAvailability.spotsLeft) {
        toast({
          title: "Too many participants",
          description: `Only ${courseAvailability.spotsLeft} spots available for this course.`,
          variant: "destructive",
        });
        return;
      }
      
      // Check course availability again right before submitting
      const availability = await checkCourseAvailability(courseId, course.spotsAvailable);
      if (availability.spotsLeft < participantCount) {
        toast({
          title: "Not enough spots available",
          description: `Sorry, only ${availability.spotsLeft} spots are now available which is not enough for your group.`,
          variant: "destructive",
        });
        return;
      }
      
      // Create registrations for all participants
      const registrationsData = values.participants.map(participant => ({
        course_id: courseId,
        first_name: participant.firstName,
        last_name: participant.lastName,
        email: participant.email,
        phone: participant.phone || null,
        company: values.organizationName,
        additional_notes: `Group registration by ${values.contactPerson.firstName} ${values.contactPerson.lastName} (${values.contactPerson.email}, ${values.contactPhone})${values.additionalNotes ? `. Notes: ${values.additionalNotes}` : ''}`,
        status: 'pending'
      }));
      
      const { error } = await supabase
        .from('course_registrations')
        .insert(registrationsData);

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      setRegistrationSuccess(true);
      
      // Show success toast
      toast({
        title: "Group registration successful!",
        description: `You've successfully registered ${participantCount} participants for ${course.title}.`,
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
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Group Registration Successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          Thank you for registering your group for {course.title}. We'll contact you with further details shortly.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (courseAvailability.isFull) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Course is full</AlertTitle>
        <AlertDescription>
          Sorry, this course is currently full. Please contact us for waiting list options or check our other courses.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      {courseAvailability.spotsLeft <= 5 && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Limited Availability</AlertTitle>
          <AlertDescription className="text-amber-700">
            Only {courseAvailability.spotsLeft} {courseAvailability.spotsLeft === 1 ? 'spot' : 'spots'} remaining for this course.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Organization Information</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person's first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact person's last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Contact email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone*</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Contact phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific requirements or questions?" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
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
