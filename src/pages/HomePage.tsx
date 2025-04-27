
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Agile Training
          {user && ` ${user.email}`}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your journey to agile excellence starts here.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {['Courses', 'Workshops', 'Resources'].map((item) => (
            <div key={item} className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{item}</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
