
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BlogPreviewSection = () => {
  const posts = [
    {
      title: "5 Key Principles of Agile Leadership",
      excerpt: "Learn the essential principles that make agile leaders effective in today's fast-paced environment.",
      date: "April 20, 2025",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Building High-Performing Agile Teams",
      excerpt: "Discover proven strategies for developing and nurturing successful agile teams.",
      date: "April 18, 2025",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Latest Insights</h2>
        <p className="text-gray-600 text-center mb-12">
          Stay updated with our latest thoughts on agile leadership and transformation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Button asChild variant="outline">
                  <Link to="/blog">Read More</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/blog">Visit Our Blog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
