
const ClientLogos = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-xl text-center text-gray-600 mb-8">Trusted by Leading Organizations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="h-12 w-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400">Logo {index}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
