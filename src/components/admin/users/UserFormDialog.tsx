
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User } from "@/types/user";
import { UserForm } from "./UserForm";
import { UserFormValues } from "./userSchema";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: UserFormValues) => void;
}

export function UserFormDialog({ 
  isOpen, 
  onClose, 
  user, 
  onSubmit
}: UserFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Update the details of the existing user'
              : 'Fill out the form to create a new user'}
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          user={user} 
          onSubmit={onSubmit} 
          onCancel={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
}
