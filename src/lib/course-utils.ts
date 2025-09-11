import { courses, Course } from "./mock-data";

// Progress tracking utilities
export const getCourseProgress = (courseId: string): number => {
	const course = courses.find(c => c.id === courseId);
	return course?.progress || 0;
};

export const getTotalChapters = (courseId: string): number => {
	const course = courses.find(c => c.id === courseId);
	return course?.sections.reduce((total, section) => total + section.chapters.length, 0) || 0;
};

export const getCompletedChapters = (courseId: string): number => {
	const course = courses.find(c => c.id === courseId);
	return course?.completedChapters.length || 0;
};

export const calculateProgressPercentage = (courseId: string): number => {
	const total = getTotalChapters(courseId);
	const completed = getCompletedChapters(courseId);
	return total > 0 ? Math.round((completed / total) * 100) : 0;
};

// Legacy function - kept for backward compatibility
export const isChapterCompleted = (courseId: string, chapterId: string): boolean => {
	const course = courses.find(c => c.id === courseId);
	return course?.completedChapters.includes(chapterId) || false;
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
		.replace(/[^\w\s-]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
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
 * Extracts the course ID from a combined ID-slug URL
 * @param idSlug The combined ID-slug string
 * @returns The extracted course ID
 */
export const extractCourseId = (idSlug: string): string => {
	// Extract everything before the first hyphen
	const match = idSlug.match(/^([^-]+)/);
	return match ? match[1] : idSlug;
};

/**
 * Gets a course by its combined ID-slug
 * @param idSlug The combined ID-slug string
 * @returns The course object or undefined if not found
 */
export const getCourseBySlug = (idSlug: string) => {
	const courseId = extractCourseId(idSlug);
	return courses.find(course => course.id === courseId);
};

/**
 * Generates a combined ID-slug URL for a section
 * @param sectionId The section ID
 * @param title The section title
 * @returns A URL-friendly ID-slug combination
 */
export const generateSectionSlug = (sectionId: string, title: string): string => {
	const slug = generateSlug(title);
	return `${sectionId}-${slug}`;
};

/**
 * Generates a combined ID-slug URL for a chapter
 * @param chapterId The chapter ID
 * @param title The chapter title
 * @returns A URL-friendly ID-slug combination
 */
export const generateChapterSlug = (chapterId: string, title: string): string => {
	const slug = generateSlug(title);
	return `${chapterId}-${slug}`;
};

/**
 * Gets a section by its combined ID-slug
 * @param courseId The course ID
 * @param sectionSlug The combined section ID-slug string
 * @returns The section object or undefined if not found
 */
export const getSectionBySlug = (courseId: string, sectionSlug: string) => {
	const course = courses.find(c => c.id === courseId);
	const sectionId = extractCourseId(sectionSlug);
	return course?.sections.find(section => section.id === sectionId);
};

/**
 * Gets a chapter by its combined ID-slug
 * @param courseId The course ID
 * @param sectionId The section ID
 * @param chapterSlug The combined chapter ID-slug string
 * @returns The chapter object or undefined if not found
 */
export const getChapterBySlug = (courseId: string, sectionId: string, chapterSlug: string) => {
	const course = courses.find(c => c.id === courseId);
	const section = course?.sections.find(s => s.id === sectionId);
	const chapterId = extractCourseId(chapterSlug);
	return section?.chapters.find(chapter => chapter.id === chapterId);
};

/**
 * Gets the last viewed chapter for a course
 * @param courseId The course ID
 * @returns The last viewed chapter or the first chapter if none viewed
 */
export const getLastViewedChapter = (courseId: string) => {
	const course = courses.find(c => c.id === courseId);
	// For now, return the first chapter of the first section
	// In a real app, this would be stored in user progress data
	return course?.sections[0]?.chapters[0];
};

/**
 * Gets the next chapter in sequence
 * @param courseId The course ID
 * @param sectionId The current section ID
 * @param chapterId The current chapter ID
 * @returns The next chapter object or undefined if at the end
 */
export const getNextChapter = (courseId: string, sectionId: string, chapterId: string) => {
	const course = courses.find(c => c.id === courseId);
	if (!course) return undefined;
	
	const sectionIndex = course.sections.findIndex(s => s.id === sectionId);
	if (sectionIndex === -1) return undefined;
	
	const section = course.sections[sectionIndex];
	const chapterIndex = section.chapters.findIndex(c => c.id === chapterId);
	
	// If not the last chapter in section
	if (chapterIndex < section.chapters.length - 1) {
		return section.chapters[chapterIndex + 1];
	}
	
	// If last chapter in section but not last section
	if (sectionIndex < course.sections.length - 1) {
		return course.sections[sectionIndex + 1].chapters[0];
	}
	
	// No next chapter
	return undefined;
};

/**
 * Gets the previous chapter in sequence
 * @param courseId The course ID
 * @param sectionId The current section ID
 * @param chapterId The current chapter ID
 * @returns The previous chapter object or undefined if at the beginning
 */
export const getPreviousChapter = (courseId: string, sectionId: string, chapterId: string) => {
	const course = courses.find(c => c.id === courseId);
	if (!course) return undefined;
	
	const sectionIndex = course.sections.findIndex(s => s.id === sectionId);
	if (sectionIndex === -1) return undefined;
	
	const section = course.sections[sectionIndex];
	const chapterIndex = section.chapters.findIndex(c => c.id === chapterId);
	
	// If not the first chapter in section
	if (chapterIndex > 0) {
		return section.chapters[chapterIndex - 1];
	}
	
	// If first chapter in section but not first section
	if (sectionIndex > 0) {
		const prevSection = course.sections[sectionIndex - 1];
		return prevSection.chapters[prevSection.chapters.length - 1];
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
export const isChapterCompletedObj = (course: Course, chapterId: string): boolean => {
	return course?.completedChapters.includes(chapterId) || false;
};

/**
 * Gets the progress percentage for a chapter
 * @param course The course object
 * @param chapterId The chapter ID to check
 * @returns Progress percentage (0-100)
 */
export const getChapterProgress = (course: Course, chapterId: string): number => {
	return isChapterCompletedObj(course, chapterId) ? 100 : 0;
};

/**
 * Calculates the overall course progress percentage
 * @param course The course object
 * @returns Progress percentage (0-100)
 */
export const calculateCourseProgress = (course: Course): number => {
	const totalChapters = course.sections.reduce((total: number, section: any) => {
		return total + section.chapters.length;
	}, 0);
	
	if (totalChapters === 0) return 0;
	
	return Math.round((course.completedChapters.length / totalChapters) * 100);
};