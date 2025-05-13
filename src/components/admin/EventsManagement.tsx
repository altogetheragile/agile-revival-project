
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsManagement = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to CourseManagement since we've eliminated dedicated Events functionality
    navigate('/admin/courses');
  }, [navigate]);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Redirecting to Courses Management...</h1>
      <p className="text-muted-foreground">
        The Events Management feature has been integrated into Courses Management.
        You will be redirected shortly.
      </p>
    </div>
  );
};

export default EventsManagement;
