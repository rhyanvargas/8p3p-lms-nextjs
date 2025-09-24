import { getCourseBySlug } from "@/lib/course-utils";
import { Button } from "@/components/ui/button";
import { CourseOverview } from "@/components/course/course-overview";

interface CoursePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function CoursePage({ params }: CoursePageProps) {
	// Await params in server component
	const { id } = await params;

	// Find the course by slug (which contains the ID)
	const course = getCourseBySlug(id);

	// If course not found, show error message
	if (!course) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
				<h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
				<p className="text-muted-foreground mb-6">
					The course you&apos;re looking for doesn&apos;t exist or has been
					removed.
				</p>
				<Button onClick={() => window.history.back()}>Go Back</Button>
			</div>
		);
	}

	return <CourseOverview course={course} />;
}
