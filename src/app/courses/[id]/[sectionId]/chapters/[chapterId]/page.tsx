import { Button } from "@/components/ui/button";
import { ChapterContent } from "@/components/course/chapter-content";
import { 
  getCourseBySlug,
  extractSectionId,
  extractChapterId
} from "@/lib/course-utils";

interface ChapterPageProps {
  params: Promise<{
    id: string;
    sectionId: string;
    chapterId: string;
  }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  // Await params in server component
  const { id, sectionId, chapterId } = await params;
  
  // Extract IDs from slugs
  const sectionIdValue = extractSectionId(sectionId);
  const chapterIdValue = extractChapterId(chapterId);
  
  // Find the course, section, and chapter
  const course = getCourseBySlug(id);
  const section = course?.sections.find((s) => s.id === sectionIdValue);
  const chapter = section?.chapters.find((c) => c.id === chapterIdValue);
  
  // If any of the resources are not found, show error message
  if (!course || !section || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The chapter you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return <ChapterContent course={course} section={section} chapter={chapter} />;
}
