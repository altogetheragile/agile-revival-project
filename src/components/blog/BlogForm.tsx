
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { BlogPostFormData } from "@/types/blog";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useState } from "react";
import { BasicBlogFields } from "./form-utils/BasicBlogFields";
import { BlogMetaFields } from "./form-utils/BlogMetaFields";
import BlogImageField from "./form-utils/BlogImageField";
import { BlogFormActions } from "./form-utils/BlogFormActions";

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
  
  const form = useForm<BlogPostFormData>({
    defaultValues: initialData
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicBlogFields form={form} />
        <BlogMetaFields form={form} />
        
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

        <BlogFormActions onCancel={onCancel} initialData={initialData} />
      </form>
    </Form>
  );
};

export default BlogForm;
