
import { BlogPost } from "@/types/blog";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BlogPostGridProps {
  posts: BlogPost[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const BlogPostGrid = ({ posts, onEdit, onDelete }: BlogPostGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id} className="border rounded-md p-4 relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onEdit(post.id)}>
                <Edit size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(post.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div className="pt-8">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {post.date} • {post.isDraft ? 'Draft' : 'Published'}
              </p>
              <p className="mt-2 line-clamp-2">{post.content}</p>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-2 text-center py-8 text-gray-500">
          No blog posts found. Click "Add New Post" to create one.
        </div>
      )}
    </div>
  );
};
