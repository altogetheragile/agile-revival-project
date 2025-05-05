
import React from 'react';
import { BlogPost } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BlogPostGridProps {
  posts: BlogPost[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BlogPostGrid: React.FC<BlogPostGridProps> = ({ posts, onEdit, onDelete }) => {
  // Function to truncate text
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {posts.map(post => (
        <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          {post.imageUrl && (
            <div 
              className="h-40 bg-cover bg-center" 
              style={{ backgroundImage: `url(${post.imageUrl})` }}
            />
          )}
          <CardContent className="p-4 pt-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium line-clamp-2">{post.title}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={post.isDraft ? "outline" : "default"} className="ml-2">
                      {post.isDraft ? (
                        <EyeOff className="h-3 w-3 mr-1" />
                      ) : (
                        <Eye className="h-3 w-3 mr-1" />
                      )}
                      {post.isDraft ? "Draft" : "Published"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{post.isDraft ? "Not publicly visible" : "Publicly visible"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="text-sm text-gray-500 flex items-center mb-2">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{post.date}</span>
            </div>
            
            <div className="text-sm text-gray-700 mb-4 line-clamp-3">
              {truncate(post.content, 150)}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(post.id.toString())}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDelete(post.id.toString())}
                className="border-red-200 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
