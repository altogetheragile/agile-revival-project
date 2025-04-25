
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactInfo } from "@/hooks/useContactInfo";

const ContactSection = () => {
  const { email, phone, location } = useContactInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented later
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Get in Touch</h2>
        <p className="text-gray-600 text-center mb-12">
          Ready to start your agile transformation journey? Contact us today.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input placeholder="Your Name" required />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" required />
              </div>
              <div>
                <Input placeholder="Subject" required />
              </div>
              <div>
                <Textarea placeholder="Your Message" required rows={4} />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              {email && (
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-agile-purple" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href={`mailto:${email}`} className="text-gray-600 hover:text-agile-purple">
                      {email}
                    </a>
                  </div>
                </div>
              )}
              
              {phone && (
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-agile-purple" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href={`tel:${phone}`} className="text-gray-600 hover:text-agile-purple">
                      {phone}
                    </a>
                  </div>
                </div>
              )}
              
              {location && (location.city || location.country) && (
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-agile-purple" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-gray-600">
                      {[location.city, location.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
