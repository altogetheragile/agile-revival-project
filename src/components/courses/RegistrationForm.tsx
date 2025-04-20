
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
import { useContactInfo } from "@/hooks/useContactInfo";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export type RegistrationFormValues = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  course: Course;
  onComplete: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ course, onComplete }) => {
  const { toast } = useToast();
  const { email: contactEmail } = useContactInfo();
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [courseAvailability, setCourseAvailability] = useState<{
    isFull: boolean;
    spotsLeft: number;
  }>({ isFull: false, spotsLeft: course.spotsAvailable });

  // Debug logging
  useEffect(() => {
    console.log("Registration form using contact email:", contactEmail);
  }, [contactEmail]);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      additionalNotes: "",
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

  const onSubmit = async (values: RegistrationFormValues) => {
    try {
      setSubmitting(true);
      
      // Ensure we're using string format for course_id
      const courseId = String(course.id);
      console.log("Registering for course_id:", courseId);
      
      // Check course availability again right before submitting
      const availability = await checkCourseAvailability(courseId, course.spotsAvailable);
      if (availability.isFull) {
        toast({
          title: "Course is full",
          description: "Sorry, this course is now full. Please try another course or contact us.",
          variant: "destructive",
        });
        return;
      }
      
      const registrationData = {
        course_id: courseId,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        company: values.company || null,
        additional_notes: values.additionalNotes || null,
        status: 'pending',
        contact_email: contactEmail, // Store the current contact email from site settings
      };
      
      console.log("Submitting registration data with contact email:", contactEmail);
      
      const { error, data } = await supabase
        .from('course_registrations')
        .insert(registrationData)
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Registration successful:", data);
      setRegistrationSuccess(true);
      
      // Show success toast
      toast({
        title: "Registration successful!",
        description: `You've successfully registered for ${course.title}. We'll contact you with further details.`,
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
        <AlertTitle className="text-green-800">Registration Successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          Thank you for registering for {course.title}. We'll contact you with further details shortly.
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
      {courseAvailability.spotsLeft <= 3 && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Limited Availability</AlertTitle>
          <AlertDescription className="text-amber-700">
            Only {courseAvailability.spotsLeft} {courseAvailability.spotsLeft === 1 ? 'spot' : 'spots'} remaining for this course. Register now to secure your place.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone*</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onComplete}>Cancel</Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Processing..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;
