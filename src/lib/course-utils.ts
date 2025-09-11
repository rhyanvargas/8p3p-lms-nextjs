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