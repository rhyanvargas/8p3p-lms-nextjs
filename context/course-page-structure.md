# Course Page Structure

This document outlines the structure and navigation flow of the course pages in the LMS application.

## URL Structure

We use a hierarchical URL structure that includes slugs for SEO benefits while maintaining IDs for reliable backend lookups:

```
/courses/[courseId-slug]                                    # Course overview
/courses/[courseId-slug]/[sectionId-slug]/chapters/[chapterId-slug]  # Chapter content
```

Example:
```
/courses/course_001-emdr-basics
/courses/course_001-emdr-basics/section_001-introduction/chapters/chapter_001-getting-started
```

## Components Structure

### Course Overview Page
- **Path**: `/courses/[id]/page.tsx`
- **Component**: `CourseOverview`
- **Features**:
  - Course header with title, description, and progress
  - "Resume" button for continuing from last viewed chapter
  - List of sections with expandable chapters
  - Chapter details (title, learning objective)
  - Progress tracking

### Chapter Content Page
- **Path**: `/courses/[id]/[sectionId]/chapters/[chapterId]/page.tsx`
- **Component**: `ChapterContent`
- **Features**:
  - Video/media player
  - Interactive script
  - Quiz with 4 questions × 4 options
  - "Ask a Question" functionality
  - Navigation between chapters
  - Tabbed interface for content and quiz

### Navigation Components
- **Sidebar**: `CourseSidebar`
  - Overview link
  - Section/chapter navigation
  - Progress indicators
- **Breadcrumbs**: `BreadcrumbNav`
  - Always starts with "Dashboard"
  - Shows course > section > chapter hierarchy

## Utility Functions

Located in `src/lib/course-utils.ts`:

- `generateCourseSlug(courseId, title)`: Creates SEO-friendly course URLs
- `generateSectionSlug(sectionId, title)`: Creates section slugs
- `generateChapterSlug(chapterId, title)`: Creates chapter slugs
- `extractCourseId(idSlug)`: Extracts ID from slug for data lookup
- `getNextChapter(courseId, sectionId, chapterId)`: Navigation helper
- `getPreviousChapter(courseId, sectionId, chapterId)`: Navigation helper
- `getLastViewedChapter(courseId)`: For resume functionality

## Data Structure

Courses are structured hierarchically:
- Course
  - Sections
    - Chapters
      - Content (video, script)
      - Quiz

## Best Practices

1. **Slug Generation**: Always use the utility functions to generate and parse slugs
2. **Navigation**: Use the breadcrumb component for consistent navigation
3. **Progress Tracking**: Update progress when chapters are completed
4. **Component Reuse**: Use the shared components for consistent UI
5. **TypeScript**: Ensure proper typing for all components and data

## Future Enhancements

1. Store generated slugs in the database for faster lookups
2. Implement redirects for handling slug changes while maintaining the same ID
3. Add section landing pages if needed in the future
