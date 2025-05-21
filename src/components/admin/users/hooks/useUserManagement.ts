
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { User, UserFormValues } from "@/types/user";
import { supabase } from "@/integrations/supabase/client";

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Use RPC for users with admin role to avoid recursion issues
      const { data, error } = await supabase
        .from('application_users')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const transformedUsers: User[] = data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: validateRole(user.role),
          status: validateStatus(user.status),
          createdAt: new Date(user.created_at).toISOString().split('T')[0]
        }));
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deleteId: string) => {
    try {
      const { error } = await supabase
        .from('application_users')
        .delete()
        .eq('id', deleteId);
      
      if (error) throw error;
      
      setUsers(users.filter(user => user.id !== deleteId));
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: UserFormValues, currentUser: User | null) => {
    try {
      if (currentUser) {
        // Update existing user
        const { error } = await supabase
          .from('application_users')
          .update({
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            status: data.status,
          })
          .eq('id', currentUser.id);

        if (error) throw error;

        setUsers(users.map(user => 
          user.id === currentUser.id 
            ? { 
                ...user, 
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                status: data.status,
              } 
            : user
        ));

        toast({
          title: "User updated",
          description: "User information has been updated successfully.",
        });
      } else {
        // Create new user
        const { data: newUser, error } = await supabase
          .from('application_users')
          .insert({
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
            status: data.status
          })
          .select()
          .single();

        if (error) throw error;

        const formattedUser: User = {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: validateRole(newUser.role),
          status: validateStatus(newUser.status),
          createdAt: new Date(newUser.created_at).toISOString().split('T')[0]
        };
        setUsers([...users, formattedUser]);
        
        toast({
          title: "User created",
          description: "New user has been created successfully.",
        });
      }
      return true;
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    handleDelete,
    handleSubmit
  };
};

const validateRole = (role: string): 'admin' | 'user' | 'editor' => {
  if (role === 'admin' || role === 'user' || role === 'editor') {
    return role;
  }
  return 'user';
};

const validateStatus = (status: string): 'active' | 'inactive' | 'pending' => {
  if (status === 'active' || status === 'inactive' || status === 'pending') {
    return status;
  }
  return 'active';
};
