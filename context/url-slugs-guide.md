# URL Slugs with ID Reference Guide

## Overview

This guide explains our implementation of SEO-friendly URLs that include both a unique ID and a readable slug for course pages.

## Implementation Pattern

We use a combined ID-slug pattern:
```
/courses/[id]-[slug]
```

For example: `/courses/course_emdr_001-emdr-therapist-training`

## Benefits

1. **SEO Benefits**: Human-readable URLs improve search engine ranking
2. **User Experience**: URLs are descriptive and easier to understand
3. **Reliable Backend Lookups**: The ID ensures stable database queries
4. **Flexibility**: Title/slug can change without breaking links

## Implementation Details

### 1. Slug Generation

We generate slugs using the `generateCourseSlug` function in `src/lib/course-utils.ts`:

```typescript
export const generateCourseSlug = (courseId: string, title: string): string => {
  const slug = generateSlug(title);
  return `${courseId}-${slug}`;
};

// Helper function to create URL-friendly strings
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();                  // Trim leading/trailing spaces
};
```

### 2. ID Extraction

When retrieving a course, we extract the ID from the combined slug:

```typescript
export const extractCourseId = (idSlug: string): string => {
  // Extract everything before the first hyphen
  const match = idSlug.match(/^([^-]+)/);
  return match ? match[1] : idSlug;
};

export const getCourseBySlug = (idSlug: string) => {
  const courseId = extractCourseId(idSlug);
  return courses.find(course => course.id === courseId);
};
```

### 3. Usage in Components

In the CourseCard component:

```typescript
const handleContinue = () => {
  const slug = generateCourseSlug(id, title);
  router.push(`/courses/${slug}`);
};
```

In the course detail page:

```typescript
export default function CoursePage({ params }: CoursePageProps) {
  const { id } = useParams(params);
  const course = getCourseBySlug(id);
  // ...
}
```

## Best Practices

1. **Always Use the Utility Functions**: Don't manually construct or parse slugs
2. **Keep IDs Stable**: Never change the ID of an existing course
3. **Update Slugs When Titles Change**: Regenerate slugs when course titles are updated
4. **Handle Legacy URLs**: Support both ID-only and ID-slug formats for backward compatibility

## Future Considerations

When moving to a real API:
1. Store the generated slug in the database for faster lookups
2. Add a redirect system for handling slug changes while maintaining the same ID
