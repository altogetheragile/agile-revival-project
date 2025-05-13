
import React from 'react';
import { DeleteConfirmationDialog } from "../users/DeleteConfirmationDialog";

interface BlogConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const BlogConfirmDeleteDialog: React.FC<BlogConfirmDeleteDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  );
};
