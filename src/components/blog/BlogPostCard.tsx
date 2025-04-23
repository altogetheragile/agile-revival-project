
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/types/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    
  // Parse the aspect ratio string into a number
  const getAspectRatioValue = (ratio?: string): number => {
    if (!ratio || ratio === "auto") return 16/9; // Default to 16:9
    const [width, height] = ratio.split("/").map(Number);
    return width / height;
  };

  // Get image size style
  const getImageSizeStyle = () => {
    if (!post.imageSize || post.imageSize === 100) return {};
    return { width: `${post.imageSize}%`, margin: '0 auto' };
  };

  // Render image based on layout
  const renderImage = () => {
    if (!post.imageUrl) return null;
    
    const imageStyle = getImageSizeStyle();
    
    return (
      <div className="w-full" style={imageStyle}>
        {post.imageAspectRatio === "auto" ? (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full object-contain"
          />
        ) : (
          <AspectRatio ratio={getAspectRatioValue(post.imageAspectRatio)}>
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        )}
      </div>
    );
  };

  // Render the card content based on layout
  const renderPostLayout = () => {
    const layout = post.imageLayout || "standard";
    
    if (layout === "side-by-side" && post.imageUrl) {
      return (
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              {renderImage()}
            </div>
            <div className="md:w-1/2">
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
            </div>
          </div>
        </Card>
      );
    }
    
    if (layout === "image-left" && post.imageUrl) {
      return (
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-4">
              {renderImage()}
            </div>
            <div className="md:w-2/3">
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
            </div>
          </div>
        </Card>
      );
    }
    
    // Default layout (standard, image-top, full-width, etc.)
    return (
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        {post.imageUrl && renderImage()}
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
  
  return renderPostLayout();
};

export default BlogPostCard;
