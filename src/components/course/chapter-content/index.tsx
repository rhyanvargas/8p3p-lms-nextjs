"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { VideoPlayer } from "./video-player";
import { InteractiveScript } from "./interactive-script";
import { ChapterQuiz } from "./chapter-quiz";
import { Button } from "@/components/ui/button";
import { Course, Section, Chapter } from "@/lib/mock-data";
import {
	generateCourseSlug,
	generateSectionSlug,
	generateChapterSlug,
	getNextChapter,
} from "@/lib/course-utils";

interface ChapterContentProps {
	course: Course;
	chapter: Chapter;
	section: Section;
}

export function ChapterContent({
	course,
	chapter,
	section,
}: ChapterContentProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"transcript" | "quiz">();

	// Generate slugs for navigation
	const courseSlug = generateCourseSlug(course.id, course.title);

	// Get next section for navigation
	const nextSection = getNextChapter(course.id, chapter.id, section.id);

	// Navigation functions
	const navigateToSection = (
		chapterId: string,
		sectionId: string,
		sectionTitle: string
	) => {
		const chapterSlug = generateChapterSlug(chapterId, chapter.title);
		const sectionSlug = generateSectionSlug(sectionId, sectionTitle);
		router.push(
			`/courses/${courseSlug}/${chapterSlug}/sections/${sectionSlug}`
		);
	};

	const handleNextSection = () => {
		if (nextSection) {
			const nextChapter = course.chapters.find((c) =>
				c.sections.some((s) => s.id === nextSection.id)
			);
			if (nextChapter) {
				navigateToSection(nextChapter.id, nextSection.id, nextSection.title);
			}
		}
	};

	return (
		<div className="container mx-auto px-4 py-6 max-w-7xl">
			{/* Section Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{section.title}</h1>
				<p className="text-muted-foreground">{section.learningObjective}</p>
			</div>

			{/* Content Layout - Different layouts based on section type */}
			{section.sectionType === "video" ? (
				/* 2-Column Layout for Video Sections */
				<div className="flex gap-2 bg-white border border-gray-200 rounded-lg flex-wrap">
					{/* Video Player Container - Left Column */}
					<div className=" p-4 flex-auto w-[600px]">
						<VideoPlayer
							videoId={section.id}
							transcript={section.videoScript}
						/>
					</div>

					{/* Transcript Container - Right Column */}
					<div className="bg-white border-l border-gray-200 flex-auto w-[300px]">
						{/* Transcript Header */}
						<div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
							<h3 className="text-sm font-medium text-gray-900">
								Interactive Transcript
							</h3>
						</div>

						{/* Transcript Content */}
						<div className="p-4 h-[400px] overflow-y-auto">
							<InteractiveScript
								script={
									section.videoScript ||
									"No transcript available for this section."
								}
							/>
						</div>
					</div>
				</div>
			) : section.sectionType === "quiz" ? (
				/* Full Width Layout for Quiz Sections */
				<div className="mb-8">
					<ChapterQuiz
						quiz={{
							id: section.quiz!.id,
							title: section.quiz!.title,
							description: section.quiz!.description,
							questions: section.quiz!.questions,
							passingScore: section.quiz!.passingScore,
						}}
					/>
				</div>
			) : (
				/* Default Layout for Other Section Types (AI Avatar, etc.) */
				<div className="mb-8">
					<div className="flex border-b mb-6">
						<button
							className={`px-4 py-2 font-medium ${
								activeTab === "transcript"
									? "border-b-2 border-primary text-primary"
									: "text-muted-foreground"
							}`}
							onClick={() => setActiveTab("transcript")}
						>
							Transcript
						</button>
						{section.quiz && (
							<button
								className={`px-4 py-2 font-medium ${
									activeTab === "quiz"
										? "border-b-2 border-primary text-primary"
										: "text-muted-foreground"
								}`}
								onClick={() => setActiveTab("quiz")}
							>
								Quiz
							</button>
						)}
					</div>
					<div>
						{activeTab === "transcript" ? (
							<InteractiveScript
								script={
									section.videoScript ||
									"No transcript available for this section."
								}
							/>
						) : section.quiz ? (
							<ChapterQuiz
								quiz={{
									id: section.quiz.id,
									title: section.quiz.title,
									description: section.quiz.description,
									questions: section.quiz.questions,
									passingScore: section.quiz.passingScore,
								}}
							/>
						) : (
							<div>No quiz available for this section.</div>
						)}
					</div>
				</div>
			)}

			{/* Navigation */}
			{nextSection && (
				<Button onClick={handleNextSection} className="mt-4">
					Next: {nextSection.title}
				</Button>
			)}
		</div>
	);
}
