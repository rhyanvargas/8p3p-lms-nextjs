"use client";

import { courses } from "@/lib/mock-data";
import { getCourseBySlug, extractCourseId } from "@/lib/course-utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, BookOpen, Clock } from "lucide-react";
import { useParams } from "@/hooks/use-params";

interface CoursePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function CoursePage({ params }: CoursePageProps) {
	// Use our custom hook to safely unwrap params
	const { id } = useParams(params);
	
	// Find the course by slug (which contains the ID)
	const course = getCourseBySlug(id);
	
	// If course not found, show error message
	if (!course) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
				<h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
				<p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
				<Button onClick={() => window.history.back()}>Go Back</Button>
			</div>
		);
	}

	// Get first chapter of first section for "Start Learning" button
	const firstSection = course.sections[0];
	const firstChapter = firstSection?.chapters[0];

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Course Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{course.title}</h1>
				<p className="text-muted-foreground mb-4">{course.description}</p>
				
				<div className="flex items-center gap-4 mb-6">
					<div className="flex items-center gap-1">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm">{course.duration}</span>
					</div>
					<div className="flex items-center gap-1">
						<BookOpen className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm">{course.sections.reduce((total, section) => total + section.chapters.length, 0)} chapters</span>
					</div>
				</div>
				
				<div className="flex flex-col sm:flex-row gap-4">
					<Button size="lg" className="gap-2">
						Start Learning
						<ChevronRight className="h-4 w-4" />
					</Button>
					
					<div className="flex-1 max-w-md">
						<div className="flex justify-between items-center mb-1">
							<span className="text-sm font-medium">Your Progress</span>
							<span className="text-sm text-muted-foreground">{course.progress}%</span>
						</div>
						<Progress value={course.progress} className="h-2" />
					</div>
				</div>
			</div>
			
			{/* Course Content */}
			<div className="space-y-6">
				<h2 className="text-2xl font-semibold">Course Content</h2>
				
				{course.sections.map((section, index) => (
					<Card key={section.id} className="overflow-hidden">
						<CardHeader className="bg-muted/50">
							<CardTitle className="text-lg">
								Section {index + 1}: {section.title}
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<ul className="divide-y">
								{section.chapters.map((chapter, chapterIndex) => (
									<li key={chapter.id} className="p-4 hover:bg-muted/50 transition-colors">
										<div className="flex justify-between items-center">
											<div>
												<p className="font-medium">{chapterIndex + 1}. {chapter.title}</p>
												<p className="text-sm text-muted-foreground">
													{chapter.learningObjective}
												</p>
											</div>
											<Button variant="ghost" size="sm">
												View
											</Button>
										</div>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
