
const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-4">
                ★★★★★
              </div>
              <p className="text-gray-600 mb-4">
                "The training exceeded our expectations. The practical approach and expert guidance helped our team embrace agile practices effectively."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">John Doe</div>
                  <div className="text-sm text-gray-500">Scrum Master at Tech Co</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
