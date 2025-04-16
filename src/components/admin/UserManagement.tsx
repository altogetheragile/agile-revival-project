
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { User, UserFormValues } from "@/types/user";
import { mockUsers } from "@/data/mockUsers";
import { UserManagementHeader } from "./users/UserManagementHeader";
import { UsersTable } from "./users/UsersTable";
import { UserFormDialog } from "./users/UserFormDialog";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

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
      <UserManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
      />

      <UsersTable 
        users={filteredUsers}
        onEditUser={handleEdit}
        onDeleteUser={handleDeleteConfirm}
      />

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
