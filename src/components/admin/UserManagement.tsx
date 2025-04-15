
import { useState } from 'react';
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/user";
import { mockUsers } from "@/data/mockUsers";
import { UserList } from "./users/UserList";
import { UserFormDialog } from "./users/UserFormDialog";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";
import { UserFormValues } from "./users/userSchema";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleDelete = () => {
    if (deleteId !== null) {
      // In a real app, you would call an API to delete the user
      setUsers(users.filter(user => user.id !== deleteId));
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });
      setIsConfirmDialogOpen(false);
      setDeleteId(null);
    }
  };

  const onSubmit = (data: UserFormValues) => {
    if (currentUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === currentUser.id 
          ? { ...user, ...data } 
          : user
      ));
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });
    } else {
      // Create new user
      const newUser: User = {
        id: `${users.length + 1}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: data.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast({
        title: "User created",
        description: "New user has been created successfully.",
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <UserPlus size={16} /> Add New User
        </Button>
      </div>

      <UserList 
        users={users} 
        onEdit={handleEdit} 
        onDelete={handleDeleteConfirm} 
      />

      {/* User Form Dialog */}
      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={currentUser}
        onSubmit={onSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default UserManagement;
