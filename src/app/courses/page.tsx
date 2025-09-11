import { courses } from "@/lib/mock-data";
import { CourseCard } from "@/components/ui/course-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Display existing courses using CourseCard component */}
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            progress={course.progress || 0}
            imageUrl={course.imageUrl || "/emdr-xr-training.png"}
            totalChapters={course.sections?.reduce((total, section) => total + section.chapters.length, 0) || 0}
            completedChapters={course.completedChapters?.length || 0}
            duration={course.duration}
          />
        ))}
        
        {/* Coming Soon placeholder */}
        <Card className="border border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              <span>More Courses Coming Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We&apos;re developing additional specialized EMDR training courses to expand your professional development journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}