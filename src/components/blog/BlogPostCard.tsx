
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isContentLong = post.content.length > 150;
  const displayContent = expanded || !isContentLong 
    ? post.content 
    : `${post.content.slice(0, 150)}...`;

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      {post.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardDescription className="text-sm text-muted-foreground">
          {formatDate(post.date)}
        </CardDescription>
        <CardTitle className="text-xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className={`prose prose-sm max-w-none ${!expanded && isContentLong ? "max-h-24 overflow-hidden" : ""}`}>
          {displayContent}
        </div>
        {isContentLong && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-agile-purple hover:text-agile-purple-dark font-medium mt-2 text-sm"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </CardContent>
      <CardFooter>
        <a 
          href={post.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1 text-agile-purple hover:text-agile-purple-dark font-medium text-sm"
        >
          Read full article <ExternalLink size={16} />
        </a>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
