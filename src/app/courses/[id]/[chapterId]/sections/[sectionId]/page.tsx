import { Button } from "@/components/ui/button";
import { ChapterContent } from "@/components/course/chapter-content";
import { 
  getCourseBySlug,
  extractSectionId,
  extractChapterId
} from "@/lib/course-utils";

interface SectionPageProps {
  params: Promise<{
    id: string;
    chapterId: string;
    sectionId: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  // Await params in server component
  const { id, chapterId, sectionId } = await params;
  
  // Extract IDs from slugs
  const chapterIdValue = extractChapterId(chapterId);
  const sectionIdValue = extractSectionId(sectionId);
  
  // Find the course, chapter, and section
  const course = getCourseBySlug(id);
  const chapter = course?.chapters.find((c) => c.id === chapterIdValue);
  const section = chapter?.sections.find((s) => s.id === sectionIdValue);
  
  // If any of the resources are not found, show error message
  if (!course || !section || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The section you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return <ChapterContent course={course} section={section} chapter={chapter} />;
}
