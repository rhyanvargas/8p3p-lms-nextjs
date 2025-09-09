"use client";

interface CoursePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function CoursePage({ params }: CoursePageProps) {
	return (
		// TODO: Implement course page
		<h1>Course Content Here</h1>
	);
}
