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
  
  // Get the last viewed chapter for the "Resume" button
  const lastViewedChapter = getLastViewedChapter(course.id);
  const lastViewedSection = course.sections.find(section => 
    section.chapters.some(chapter => chapter.id === lastViewedChapter?.id)
  );
  
  // Generate chapter URL helper
  const getChapterUrl = (sectionId: string, chapterId: string, chapterTitle: string) => {
    const sectionSlug = generateSectionSlug(sectionId, 
      course.sections.find(s => s.id === sectionId)?.title || "");
    const chapterSlug = generateChapterSlug(chapterId, chapterTitle);
    return `/courses/${courseSlug}/${sectionSlug}/chapters/${chapterSlug}`;
  };
  
  // Get resume URL
  const getResumeUrl = () => {
    if (lastViewedChapter && lastViewedSection) {
      return getChapterUrl(lastViewedSection.id, lastViewedChapter.id, lastViewedChapter.title);
    } else if (course.sections.length > 0 && course.sections[0].chapters.length > 0) {
      const firstSection = course.sections[0];
      const firstChapter = firstSection.chapters[0];
      return getChapterUrl(firstSection.id, firstChapter.id, firstChapter.title);
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
                  {course.sections.reduce((total, section) => total + section.chapters.length, 0)} chapters
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
        
        {course.sections.map((section, sectionIndex) => (
          <Card key={section.id} className="overflow-hidden scroll-mt-24" id={section.id}>
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-lg">
                Section {sectionIndex + 1}: {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {section.chapters.map((chapter, _chapterIndex) => {
                  const isCompleted = course.completedChapters.includes(chapter.id);
                  const chapterUrl = getChapterUrl(section.id, chapter.id, chapter.title);
                  
                  return (
                    <li key={chapter.id}>
                      <Link 
                        href={chapterUrl}
                        className="block p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <ChapterProgress 
                                progress={isCompleted ? 100 : 0}
                                size="md"
                              />
                              <p className="font-medium">{chapter.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground ml-9 mt-1">
                              {chapter.learningObjective}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="shrink-0"
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
