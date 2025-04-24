
import { User, UserFormValues } from "@/types/user";
import { UserManagementHeader } from "./UserManagementHeader";
import { UsersTable } from "./UsersTable";
import { UserFormDialog } from "./UserFormDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

interface UserManagementContainerProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  isConfirmDialogOpen: boolean;
  onConfirmDialogOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormValues) => void;
  onConfirmDelete: () => void;
  currentUser: User | null;
}

export const UserManagementContainer = ({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onAddNew,
  onEdit,
  onDelete,
  isDialogOpen,
  onDialogOpenChange,
  isConfirmDialogOpen,
  onConfirmDialogOpenChange,
  onSubmit,
  onConfirmDelete,
  currentUser
}: UserManagementContainerProps) => {
  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <UserManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onAddNew={onAddNew}
      />

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <UsersTable 
          users={users}
          onEditUser={onEdit}
          onDeleteUser={onDelete}
        />
      )}

      <UserFormDialog 
        open={isDialogOpen}
        onOpenChange={onDialogOpenChange}
        onSubmit={onSubmit}
        currentUser={currentUser}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={onConfirmDialogOpenChange}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};
