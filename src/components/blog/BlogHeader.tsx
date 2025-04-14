
import React from 'react';

const BlogHeader = () => {
  return (
    <div className="pt-24 pb-16 bg-accent">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center">Blog</h1>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-8">
          Insights, tips, and stories about agile methodology, product management, and team leadership
        </p>
      </div>
    </div>
  );
};

export default BlogHeader;
