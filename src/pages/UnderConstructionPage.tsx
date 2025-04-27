
const UnderConstructionPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-600 mb-8">
          We're working hard to bring you this content. Please check back soon.
        </p>
        <a 
          href="/"
          className="inline-block bg-agile-purple text-white px-6 py-2 rounded-lg hover:bg-agile-purple-dark transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
