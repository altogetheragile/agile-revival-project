
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { User, UserFormValues } from "@/types/user";
import { UserManagementHeader } from "./users/UserManagementHeader";
import { UsersTable } from "./users/UsersTable";
import { UserFormDialog } from "./users/UserFormDialog";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";
import { supabase } from "@/integrations/supabase/client";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch users from Supabase when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('application_users')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data from snake_case to camelCase
        const transformedUsers = data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          status: user.status,
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

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTermLower) ||
      user.firstName.toLowerCase().includes(searchTermLower) ||
      user.lastName.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });

  const handleAddNew = () => {
    setCurrentUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setDeleteId(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        const { error } = await supabase
          .from('application_users')
          .delete()
          .eq('id', deleteId);
        
        if (error) throw error;
        
        // Remove user from local state
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
      } finally {
        setIsConfirmDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  const onSubmit = async (data: UserFormValues) => {
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

        // Update user in local state
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

        // Add new user to local state
        const formattedUser: User = {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
          status: newUser.status,
          createdAt: new Date(newUser.created_at).toISOString().split('T')[0]
        };
        setUsers([...users, formattedUser]);
        
        toast({
          title: "User created",
          description: "New user has been created successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save user. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <UserManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
      />

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <UsersTable 
          users={filteredUsers}
          onEditUser={handleEdit}
          onDeleteUser={handleDeleteConfirm}
        />
      )}

      <UserFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
        currentUser={currentUser}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserManagement;
