"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { ResponsiveBreadcrumb, BreadcrumbItem } from "@/components/course/responsive-breadcrumb";
import { Course } from "@/lib/mock-data";
import { 
  extractSectionId, 
  extractChapterId
} from "@/lib/course-utils";

interface LayoutBreadcrumbsProps {
  course: Course;
}

export function LayoutBreadcrumbs({ course }: LayoutBreadcrumbsProps) {
  // Use Next.js built-in hook to get layout segments
  const segments = useSelectedLayoutSegments();
  
  // Debug output
  console.log('LayoutBreadcrumbs - URL segments:', segments);
  console.log('LayoutBreadcrumbs - Course:', course.id, course.title);
  
  // Default breadcrumb items - Dashboard is automatically added by BreadcrumbNav
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Courses", href: "/courses" },
    { label: course.title, href: `/courses/${course.id}`, current: segments.length === 0 }
  ];
  
  // Based on the new URL structure:
  // URL segments: ["chapter_1-emdr-foundations", "sections", "section_1_2-understanding-trauma"]
  // This means the URL structure is: /courses/[id]/[chapterId]/sections/[sectionId]
  // But the segments don't include the course ID (it's in the parent layout)
  
  if (segments.length >= 1) {
    // First segment is the chapter
    const chapterSegment = segments[0];
    const chapterId = extractChapterId(chapterSegment);
    const chapter = course.chapters.find(c => c.id === chapterId);
    
    if (chapter) {
      breadcrumbItems.push({
        label: chapter.title,
        href: `/courses/${course.id}#${chapter.id}`,
        current: segments.length === 1
      });
      
      // Check if we have sections segment
      if (segments.length >= 3 && segments[1] === 'sections') {
        const sectionSegment = segments[2];
        const sectionId = extractSectionId(sectionSegment);
        const section = chapter.sections.find(s => s.id === sectionId);
        
        if (section) {
          breadcrumbItems.push({
            label: section.title,
            href: `/courses/${course.id}/${chapterSegment}/sections/${sectionSegment}`,
            current: true
          });
        }
      }
    }
  }
  
  return <ResponsiveBreadcrumb items={breadcrumbItems} />;
}
