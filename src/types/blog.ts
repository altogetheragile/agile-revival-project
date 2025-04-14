
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  url: string;
  imageUrl?: string;
  isDraft?: boolean;
}

export type BlogPostFormData = Omit<BlogPost, "id" | "date"> & {
  id?: number;
  date?: string;
};
