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
    isDraft: true 
  }, 
  onSubmit, 
  onCancel 
}) => {
  const form = useForm<BlogPostFormData>({
    defaultValues: initialData
  });

  const [mediaLibOpen, setMediaLibOpen] = useState(false);

  const handleSubmit = (data: BlogPostFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Image URL (Optional)
                <Button
                  className="ml-2"
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setMediaLibOpen(true)}
                >
                  Choose from Library
                </Button>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                  {field.value && (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="mt-2 w-36 h-20 object-contain border rounded bg-white"
                    />
                  )}
                </div>
              </FormControl>
              <FormDescription>
                URL to an image for the blog post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <MediaLibrary
          open={mediaLibOpen}
          onOpenChange={setMediaLibOpen}
          onSelect={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
        />

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

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData.id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
