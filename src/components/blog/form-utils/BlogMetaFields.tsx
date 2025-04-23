
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BlogPostFormData } from "@/types/blog";

interface BlogMetaFieldsProps {
  form: UseFormReturn<BlogPostFormData>;
}

export const BlogMetaFields: React.FC<BlogMetaFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};

