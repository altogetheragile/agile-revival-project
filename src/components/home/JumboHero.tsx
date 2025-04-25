
import { ArrowRightCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const JumboHero = () => {
  return (
    <section className="min-h-[80vh] relative flex items-center">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transforming Organizations Through Agile Leadership
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Expert coaching and training to help your teams embrace agility and drive meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-agile-purple hover:bg-agile-purple-dark">
              <Link to="/training-schedule" className="flex items-center gap-2">
                View Training Schedule
                <ArrowRightCircle className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Link to="#contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JumboHero;
