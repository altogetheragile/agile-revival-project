
import { useState, useEffect } from 'react';
import { User } from "@/types/user";
import { UserManagementContainer } from "./users/UserManagementContainer";
import { useUserManagement } from "./users/hooks/useUserManagement";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { users, loading, fetchUsers, handleDelete, handleSubmit } = useUserManagement();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const onSubmit = async (data: any) => {
    const success = await handleSubmit(data, currentUser);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const onDelete = async () => {
    if (deleteId !== null) {
      await handleDelete(deleteId);
      setIsConfirmDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <UserManagementContainer 
      users={filteredUsers}
      loading={loading}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
      onDelete={handleDeleteConfirm}
      isDialogOpen={isDialogOpen}
      onDialogOpenChange={setIsDialogOpen}
      isConfirmDialogOpen={isConfirmDialogOpen}
      onConfirmDialogOpenChange={setIsConfirmDialogOpen}
      onSubmit={onSubmit}
      onConfirmDelete={onDelete}
      currentUser={currentUser}
    />
  );
};

export default UserManagement;
