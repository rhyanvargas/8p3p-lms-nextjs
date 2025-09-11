import { courses } from "./mock-data";

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