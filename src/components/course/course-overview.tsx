import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/lib/mock-data";
import { 
  generateCourseSlug, 
  generateSectionSlug, 
  generateChapterSlug,
  getLastViewedChapter
} from "@/lib/course-utils";
import { ResumeButton } from "@/components/course/resume-button";
import { ChapterProgress } from "@/components/course/chapter-progress";

interface CourseOverviewProps {
  course: Course;
}

export function CourseOverview({ course }: CourseOverviewProps) {
  const courseSlug = generateCourseSlug(course.id, course.title);
  
  // Get the last viewed section for the "Resume" button
  const lastViewedSection = getLastViewedChapter(course.id);
  const lastViewedChapter = course.chapters.find(chapter => 
    chapter.sections.some(section => section.id === lastViewedSection?.id)
  );
  
  // Generate section URL helper
  const getSectionUrl = (chapterId: string, sectionId: string, sectionTitle: string) => {
    const chapterSlug = generateChapterSlug(chapterId, 
      course.chapters.find(c => c.id === chapterId)?.title || "");
    const sectionSlug = generateSectionSlug(sectionId, sectionTitle);
    return `/courses/${courseSlug}/${chapterSlug}/sections/${sectionSlug}`;
  };
  
  // Get resume URL
  const getResumeUrl = () => {
    if (lastViewedChapter && lastViewedSection) {
      return getSectionUrl(lastViewedChapter.id, lastViewedSection.id, lastViewedSection.title);
    } else if (course.chapters.length > 0 && course.chapters[0].sections.length > 0) {
      const firstChapter = course.chapters[0];
      const firstSection = firstChapter.sections[0];
      return getSectionUrl(firstChapter.id, firstSection.id, firstSection.title);
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Course Image */}
          <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden">
            <Image
              src={course.imageUrl || "/emdr-xr-training.png"}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Course Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {course.chapters.reduce((total, chapter) => total + chapter.sections.length, 0)} sections
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{course.progress}% complete</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
            
            {/* Resume Button */}
            <ResumeButton 
              resumeUrl={getResumeUrl()}
              hasProgress={course.progress > 0}
            />
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Course Content</h2>
        
        {course.chapters.map((chapter, chapterIndex) => (
          <Card key={chapter.id} className="overflow-hidden scroll-mt-24" id={chapter.id}>
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-lg">
                Chapter {chapterIndex + 1}: {chapter.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {chapter.sections.map((section, _sectionIndex) => {
                  const isCompleted = course.completedChapters.includes(section.id);
                  const sectionUrl = getSectionUrl(chapter.id, section.id, section.title);
                  
                  return (
                    <li key={section.id}>
                      <Link 
                        href={sectionUrl}
                        className="block p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <ChapterProgress 
                                progress={isCompleted ? 100 : 0}
                                size="md"
                              />
                              <p className="font-medium">{section.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {section.learningObjective}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                          >
                            <span>{isCompleted ? "Review" : "Start"}</span>
                          </Button>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
