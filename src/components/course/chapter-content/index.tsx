"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { VideoPlayer } from "@/components/course/chapter-content/video-player";
import { InteractiveScript } from "@/components/course/chapter-content/interactive-script";
import { ChapterQuiz } from "@/components/course/chapter-content/chapter-quiz";
import { AskQuestion } from "@/components/course/chapter-content/ask-question";
import { Course, Section, Chapter } from "@/lib/mock-data";
import { 
  generateCourseSlug, 
  generateSectionSlug, 
  generateChapterSlug,
  getNextChapter,
  getPreviousChapter
} from "@/lib/course-utils";

interface ChapterContentProps {
  course: Course;
  section: Section;
  chapter: Chapter;
}

export function ChapterContent({ course, section, chapter }: ChapterContentProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  
  // Generate slugs for navigation
  const courseSlug = generateCourseSlug(course.id, course.title);

  
  // Get next and previous chapters for navigation
  const nextChapter = getNextChapter(course.id, section.id, chapter.id);
  const prevChapter = getPreviousChapter(course.id, section.id, chapter.id);
  
  // Navigation functions
  const navigateToChapter = (sectionId: string, chapterId: string, chapterTitle: string) => {
    const targetSectionSlug = generateSectionSlug(sectionId, 
      course.sections.find(s => s.id === sectionId)?.title || "");
    const chapterSlug = generateChapterSlug(chapterId, chapterTitle);
    router.push(`/courses/${courseSlug}/${targetSectionSlug}/chapters/${chapterSlug}`);
  };
  

  
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Chapter Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
        <p className="text-muted-foreground">{chapter.learningObjective}</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'content' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'quiz' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </button>
      </div>
      
      {/* Content Area */}
      <div className="mb-8">
        {activeTab === 'content' ? (
          <div className="space-y-8">
            {/* Video Player */}
            <VideoPlayer />
            
            {/* Interactive Script */}
            <InteractiveScript script={chapter.videoScript || "No transcript available for this chapter."} />
            
            {/* Ask Question Button */}
            <AskQuestion chapterTitle={chapter.title} />
          </div>
        ) : (
          chapter.quiz ? (
            <ChapterQuiz 
              quiz={{
                ...chapter.quiz,
                description: chapter.quiz.description || "Test your knowledge from this chapter",
                passingScore: chapter.quiz.passingScore || 70
              }} 
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Quiz not available for this chapter.</p>
            </div>
          )
        )}
      </div>
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center border-t pt-6">
        <div>
          {prevChapter && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                const prevSection = course.sections.find(s => 
                  s.chapters.some(c => c.id === prevChapter.id)
                );
                if (prevSection) {
                  navigateToChapter(prevSection.id, prevChapter.id, prevChapter.title);
                }
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
        </div>
        
        <div>
          {nextChapter && (
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                const nextSection = course.sections.find(s => 
                  s.chapters.some(c => c.id === nextChapter.id)
                );
                if (nextSection) {
                  navigateToChapter(nextSection.id, nextChapter.id, nextChapter.title);
                }
              }}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
