
import React from "react";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlogPostFormData } from "@/types/blog";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useState } from "react";
import BlogImageField from "./form-utils/BlogImageField";

interface BlogFormProps {
  initialData?: BlogPostFormData;
  onSubmit: (data: BlogPostFormData) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ 
  initialData = { 
    title: "", 
    content: "", 
    url: "", 
    imageUrl: "", 
    imageAspectRatio: "16/9",
    imageSize: 100,
    imageLayout: "standard",
    isDraft: true 
  }, 
  onSubmit, 
  onCancel 
}) => {
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  
  // Initialize the form
  const form = useForm<BlogPostFormData>({
    defaultValues: initialData
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Blog post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Blog post content" 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* URL field */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/blog-post" {...field} />
              </FormControl>
              <FormDescription>
                Full URL to the blog post if hosted elsewhere
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image field using the new BlogImageField component */}
        <BlogImageField 
          form={form}
          onOpenMediaLibrary={() => setMediaLibOpen(true)}
        />

        <MediaLibrary
          open={mediaLibOpen}
          onOpenChange={(open) => {
            console.log("Media library open state changing to:", open);
            setMediaLibOpen(open);
          }}
          onSelect={(url, aspectRatio, size, layout) => {
            console.log("Selected media:", { url, aspectRatio, size, layout });
            form.setValue("imageUrl", url, { shouldValidate: true });
            form.setValue("imageAspectRatio", aspectRatio || "16/9", { shouldValidate: false });
            form.setValue("imageSize", size || 100, { shouldValidate: false });
            form.setValue("imageLayout", layout || "standard", { shouldValidate: false });
            setMediaLibOpen(false);
          }}
        />

        {/* Draft checkbox */}
        <FormField
          control={form.control}
          name="isDraft"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-agile-purple"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Save as draft</FormLabel>
                <FormDescription>
                  Draft posts won't be displayed publicly
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Form action buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
