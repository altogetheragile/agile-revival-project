
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPostFormData } from "@/types/blog";
import BlogForm from "@/components/blog/BlogForm";

interface BlogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBlogPost?: BlogPostFormData;
  onSubmit: (data: BlogPostFormData) => void;
}

export const BlogFormDialog: React.FC<BlogFormDialogProps> = ({
  open,
  onOpenChange,
  currentBlogPost,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentBlogPost?.id ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
          <DialogDescription>
            {currentBlogPost?.id 
              ? 'Update the details of the selected blog post.' 
              : 'Fill in the details to create a new blog post.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-1">
            <BlogForm 
              initialData={currentBlogPost} 
              onSubmit={onSubmit} 
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
