
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EventsManagement = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    toast.info(
      "Events management has been integrated into Courses", 
      { description: "You can now manage all event types in the Course Management section" }
    );
    navigate('/admin/courses');
  }, [navigate]);
  
  return null;
};

export default EventsManagement;
