
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  url: string;
  imageUrl?: string;
  imageAspectRatio?: string;
  imageSize?: number;
  imageLayout?: string;
  isDraft?: boolean;
}

export type BlogPostFormData = Omit<BlogPost, "id" | "date"> & {
  id?: string;
  date?: string;
};
