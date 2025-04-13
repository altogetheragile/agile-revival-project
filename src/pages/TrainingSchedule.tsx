
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Bookmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";

type CourseCategory = "scrum" | "kanban" | "leadership" | "all";

interface CourseProps {
  id: string;
  title: string;
  description: string;
  dates: string;
  location: string;
  instructor: string;
  price: string;
  category: CourseCategory;
  spotsAvailable: number;
}

const courses: CourseProps[] = [
  {
    id: "crs-001",
    title: "Professional Scrum Master I",
    description: "Learn how to be an effective Scrum Master and servant-leader for your team. Understand the Scrum framework and how to apply it successfully.",
    dates: "May 15-16, 2025",
    location: "San Francisco, CA",
    instructor: "Sarah Johnson",
    price: "$1,195",
    category: "scrum",
    spotsAvailable: 8
  },
  {
    id: "crs-002",
    title: "Advanced Product Ownership",
    description: "Deep-dive into the role of a Product Owner. Master techniques for backlog management, value maximization, and stakeholder management.",
    dates: "May 22-23, 2025",
    location: "Online - Virtual Classroom",
    instructor: "Michael Chen",
    price: "$1,295",
    category: "scrum",
    spotsAvailable: 12
  },
  {
    id: "crs-003",
    title: "Kanban System Design",
    description: "Learn how to design and implement effective Kanban systems that improve flow and delivery predictability for your teams.",
    dates: "June 5-6, 2025",
    location: "Chicago, IL",
    instructor: "Emily Rodriguez",
    price: "$1,195",
    category: "kanban",
    spotsAvailable: 10
  },
  {
    id: "crs-004",
    title: "Agile Leadership Foundations",
    description: "For managers and executives, learn how to lead and support agile transformations in your organization.",
    dates: "June 12-13, 2025",
    location: "Atlanta, GA",
    instructor: "David Washington",
    price: "$1,495",
    category: "leadership",
    spotsAvailable: 6
  },
  {
    id: "crs-005",
    title: "Team Facilitation Masterclass",
    description: "Enhance your facilitation skills to run more effective and engaging meetings and workshops with agile teams.",
    dates: "June 19-20, 2025",
    location: "Online - Virtual Classroom",
    instructor: "Lisa Park",
    price: "$995",
    category: "leadership",
    spotsAvailable: 15
  }
];

const CourseCard = ({ course }: { course: CourseProps }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-agile-purple-dark">{course.title}</CardTitle>
        <CardDescription className="font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" /> {course.dates}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-agile-purple" />
            <span>{course.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-agile-purple" />
            <span>Instructor: {course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-agile-purple" />
            <span>{course.spotsAvailable} spots available</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center">
        <div className="font-bold text-lg">{course.price}</div>
        <Button className="w-full sm:w-auto">
          <Bookmark className="mr-2 h-4 w-4" /> Reserve Spot
        </Button>
      </CardFooter>
    </Card>
  );
};

const TrainingSchedule = () => {
  const [selectedTab, setSelectedTab] = useState<CourseCategory>("all");

  const filteredCourses = selectedTab === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedTab);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-agile-purple-dark mb-4">Training Course Schedule</h1>
            <p className="text-xl text-gray-600">
              Browse our upcoming agile training courses and workshops led by expert coaches and instructors.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full max-w-6xl mx-auto" onValueChange={(value) => setSelectedTab(value as CourseCategory)}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="scrum">Scrum</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scrum" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="kanban" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leadership" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-12" />

          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-agile-purple-dark mb-6">Course Schedule At-a-Glance</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.dates}</TableCell>
                      <TableCell>{course.location}</TableCell>
                      <TableCell className="text-right">{course.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Need a custom training solution?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We offer tailored training programs for organizations of all sizes.
              Contact us to discuss your specific needs and goals.
            </p>
            <Button size="lg">
              Request Custom Training
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrainingSchedule;
