import { courses, Course } from "./mock-data";

// Progress tracking utilities
export const getCourseProgress = (courseId: string): number => {
	const course = courses.find((c) => c.id === courseId);
	return course?.progress || 0;
};

export const getTotalChapters = (courseId: string): number => {
	const course = courses.find((c) => c.id === courseId);
	return (
		course?.chapters.reduce(
			(total, chapter) => total + chapter.sections.length,
			0
		) || 0
	);
};

export const getCompletedChapters = (courseId: string): number => {
	const course = courses.find((c) => c.id === courseId);
	return course?.completedChapters.length || 0;
};

export const calculateProgressPercentage = (courseId: string): number => {
	const total = getTotalChapters(courseId);
	const completed = getCompletedChapters(courseId);
	return total > 0 ? Math.round((completed / total) * 100) : 0;
};

// Legacy function - kept for backward compatibility
export const isChapterCompleted = (
	courseId: string,
	chapterId: string
): boolean => {
	const course = courses.find((c) => c.id === courseId);
	return course?.completedChapters.includes(chapterId) || false;
};

/**
 * Gets a course by its slug
 * @param slug The course slug (e.g., "course_001-emdr-basics")
 * @returns The course object or undefined if not found
 */
export const getCourseBySlug = (slug: string) => {
	const courseId = extractCourseId(slug);
	return courses.find((c) => c.id === courseId);
};

// URL slug utilities

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove special characters
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
		.trim(); // Trim leading/trailing spaces
};

/**
 * Generates a combined ID-slug URL for a course
 * @param courseId The course ID
 * @param title The course title
 * @returns A URL-friendly ID-slug combination
 */
export const generateCourseSlug = (courseId: string, title: string): string => {
	const slug = generateSlug(title);
	return `${courseId}-${slug}`;
};

/**
 * Extracts the ID part from a combined ID-slug string
 * @param idSlug The combined ID-slug string (e.g., "course_001-emdr-basics")
 * @returns The extracted ID (e.g., "course_001")
 */
export const extractCourseId = (idSlug: string): string => {
	if (!idSlug) return "";

	// Find the position of the first hyphen
	const hyphenIndex = idSlug.indexOf("-");

	// If no hyphen is found, return the entire string as the ID
	if (hyphenIndex === -1) return idSlug;

	// Return the part before the first hyphen
	return idSlug.substring(0, hyphenIndex);
};

/**
 * Extracts the section ID part from a combined ID-slug string
 * @param idSlug The combined ID-slug string (e.g., "section_001-introduction")
 * @returns The extracted ID (e.g., "section_001")
 */
export const extractSectionId = (idSlug: string): string => {
	return extractCourseId(idSlug); // Uses the same extraction logic
};

/**
 * Extracts the chapter ID part from a combined ID-slug string
 * @param idSlug The combined ID-slug string (e.g., "chapter_001-getting-started")
 * @returns The extracted ID (e.g., "chapter_001")
 */
export const extractChapterId = (idSlug: string): string => {
	return extractCourseId(idSlug); // Uses the same extraction logic
};

/**
 * Generates a combined ID-slug URL for a section
 * @param sectionId The section ID
 * @param title The section title
 * @returns A URL-friendly ID-slug combination
 */
export const generateSectionSlug = (
	sectionId: string,
	title: string
): string => {
	const slug = generateSlug(title);
	return `${sectionId}-${slug}`;
};

/**
 * Generates a combined ID-slug URL for a chapter
 * @param chapterId The chapter ID
 * @param title The chapter title
 * @returns A URL-friendly ID-slug combination
 */
export const generateChapterSlug = (
	chapterId: string,
	title: string
): string => {
	const slug = generateSlug(title);
	return `${chapterId}-${slug}`;
};

/**
 * Gets a section by its combined ID-slug
 * @param courseId The course ID
 * @param sectionSlug The combined section ID-slug string
 * @returns The section object or undefined if not found
 */
export const getChapterBySlug = (courseId: string, chapterSlug: string) => {
	const course = courses.find((c) => c.id === courseId);
	const chapterId = extractCourseId(chapterSlug);
	return course?.chapters.find((chapter) => chapter.id === chapterId);
};

/**
 * Gets a section by its combined ID-slug
 * @param courseId The course ID
 * @param chapterId The chapter ID
 * @param sectionSlug The combined section ID-slug string
 * @returns The section object or undefined if not found
 */
export const getSectionBySlug = (
	courseId: string,
	chapterId: string,
	sectionSlug: string
) => {
	const course = courses.find((c) => c.id === courseId);
	const chapter = course?.chapters.find((c) => c.id === chapterId);
	const sectionId = extractCourseId(sectionSlug);
	return chapter?.sections.find((section) => section.id === sectionId);
};

/**
 * Gets the last viewed chapter for a course
 * @param courseId The course ID
 * @returns The last viewed chapter or the first chapter if none viewed
 */
export const getLastViewedChapter = (courseId: string) => {
	const course = courses.find((c) => c.id === courseId);
	// For now, return the first section of the first chapter
	// In a real app, this would be stored in user progress data
	return course?.chapters[0]?.sections[0];
};

/**
 * Gets the next section in sequence
 * @param courseId The course ID
 * @param chapterId The current chapter ID
 * @param sectionId The current section ID
 * @returns The next section object or undefined if at the end
 */
export const getNextChapter = (
	courseId: string,
	chapterId: string,
	sectionId: string
) => {
	const course = courses.find((c) => c.id === courseId);
	if (!course) return undefined;

	const chapterIndex = course.chapters.findIndex((c) => c.id === chapterId);
	if (chapterIndex === -1) return undefined;

	const chapter = course.chapters[chapterIndex];
	const sectionIndex = chapter.sections.findIndex((s) => s.id === sectionId);

	// If not the last section in chapter
	if (sectionIndex < chapter.sections.length - 1) {
		return chapter.sections[sectionIndex + 1];
	}

	// If last section in chapter but not last chapter
	if (chapterIndex < course.chapters.length - 1) {
		return course.chapters[chapterIndex + 1].sections[0];
	}

	// No next section
	return undefined;
};

/**
 * Gets the previous chapter in sequence
 * @param courseId The course ID
 * @param sectionId The current section ID
 * @param chapterId The current chapter ID
 * @returns The previous chapter object or undefined if at the beginning
 */
export const getPreviousChapter = (
	courseId: string,
	chapterId: string,
	sectionId: string
) => {
	const course = courses.find((c) => c.id === courseId);
	if (!course) return undefined;

	const chapterIndex = course.chapters.findIndex((c) => c.id === chapterId);
	if (chapterIndex === -1) return undefined;

	const chapter = course.chapters[chapterIndex];
	const sectionIndex = chapter.sections.findIndex((s) => s.id === sectionId);

	// If not the first section in chapter
	if (sectionIndex > 0) {
		return chapter.sections[sectionIndex - 1];
	}

	// If first section in chapter but not first chapter
	if (chapterIndex > 0) {
		const prevChapter = course.chapters[chapterIndex - 1];
		return prevChapter.sections[prevChapter.sections.length - 1];
	}

	// No previous chapter
	return undefined;
};

/**
 * Checks if a chapter is completed (object-based version)
 * @param course The course object
 * @param chapterId The chapter ID to check
 * @returns Boolean indicating if the chapter is completed
 */
export const isChapterCompletedObj = (
	course: Course,
	chapterId: string
): boolean => {
	return course?.completedChapters.includes(chapterId) || false;
};

/**
 * Gets the progress percentage for a chapter
 * @param course The course object
 * @param chapterId The chapter ID to check
 * @returns Progress percentage (0-100)
 */
export const getChapterProgress = (
	course: Course,
	chapterId: string
): number => {
	return isChapterCompletedObj(course, chapterId) ? 100 : 0;
};

/**
 * Calculates the overall course progress percentage
 * @param course The course object
 * @returns Progress percentage (0-100)
 */
export const calculateCourseProgress = (course: Course): number => {
	const totalSections = course.chapters.reduce(
		(total: number, chapter) => {
			return total + chapter.sections.length;
		},
		0
	);

	if (totalSections === 0) return 0;

	return Math.round((course.completedChapters.length / totalSections) * 100);
};
