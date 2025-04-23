
import { Button } from "@/components/ui/button";

interface BlogFormActionsProps {
  onCancel: () => void;
  initialData?: { id?: string };
}

export const BlogFormActions: React.FC<BlogFormActionsProps> = ({ 
  onCancel, 
  initialData 
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {initialData?.id ? 'Update Post' : 'Create Post'}
      </Button>
    </div>
  );
};
