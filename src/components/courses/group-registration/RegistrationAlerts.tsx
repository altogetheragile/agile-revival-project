
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Course } from "@/types/course";

interface RegistrationAlertsProps {
  course: Course;
  registrationSuccess: boolean;
  isFull: boolean;
  spotsLeft: number;
}

const RegistrationAlerts: React.FC<RegistrationAlertsProps> = ({ 
  course, 
  registrationSuccess, 
  isFull,
  spotsLeft 
}) => {
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
  
  if (isFull) {
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

  if (spotsLeft <= 5) {
    return (
      <Alert className="mb-4 bg-amber-50 border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">Limited Availability</AlertTitle>
        <AlertDescription className="text-amber-700">
          Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining for this course.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default RegistrationAlerts;
