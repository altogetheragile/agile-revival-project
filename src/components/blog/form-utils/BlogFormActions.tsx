
import { Button } from "@/components/ui/button";
import { BlogPostFormData } from "@/types/blog";

interface BlogFormActionsProps {
  onCancel: () => void;
  initialData?: BlogPostFormData;
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
