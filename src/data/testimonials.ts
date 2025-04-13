
// Sample testimonial data (can be replaced with data loaded from a spreadsheet)
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  linkedinUrl?: string;
  imageUrl?: string;
  isLinkedIn?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Director of Engineering",
    company: "TechCorp Solutions",
    content: "Working with this team transformed our development processes. Their agile coaching expertise helped us reduce delivery time by 40% while improving quality. Highly recommended for any team looking to level up their agile practices.",
    linkedinUrl: "https://www.linkedin.com/in/example1",
    imageUrl: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Product Manager",
    company: "Innovative Systems",
    content: "The leadership training provided exceptional value to our organization. Our managers are now more effective at driving results while supporting their team members. The ROI has been tremendous.",
    linkedinUrl: "https://www.linkedin.com/in/example2",
    imageUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Chief Technology Officer",
    company: "GrowFast Startup",
    content: "As a fast-growing company, we needed help scaling our agile practices. The guidance we received was invaluable - practical, tailored to our needs, and immediately applicable. Our team is now more aligned and productive than ever.",
    linkedinUrl: "https://www.linkedin.com/in/example3",
    imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "4",
    name: "Daniel Williams",
    role: "Scrum Master",
    company: "Enterprise Solutions Inc.",
    content: "The coaching we received helped us navigate complex organizational challenges. Our teams are now self-organizing more effectively, and we've seen a significant improvement in our ability to deliver value consistently.",
    linkedinUrl: "https://www.linkedin.com/in/example4",
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "VP of Operations",
    company: "Global Services Ltd",
    content: "The leadership workshop was transformative for our executive team. We gained valuable insights into our communication patterns and developed strategies that have improved collaboration across departments.",
    linkedinUrl: "https://www.linkedin.com/in/example5",
    imageUrl: "https://randomuser.me/api/portraits/women/17.jpg"
  }
];
