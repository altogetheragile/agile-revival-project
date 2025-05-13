
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPost, BlogPostFormData } from "@/types/blog";
import { 
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from "@/services/blogService";
import { seedBlogPosts } from "@/services/seedDataService";
import BlogForm from "@/components/blog/BlogForm";
import { BlogManagementHeader } from "./blog/BlogManagementHeader";
import { BlogPostGrid } from "./blog/BlogPostGrid";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, PlusCircle, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
