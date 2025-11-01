"use client";

import { useRouter } from "next/navigation";

import { ChapterQuiz } from "./chapter-quiz";
import { LearningCheckBase } from "./learning-check-base";
import { Button } from "@/components/ui/button";
import { Course, Section, Chapter } from "@/lib/mock-data";
import {
	generateCourseSlug,
	generateSectionSlug,
	generateChapterSlug,
	getNextChapter,
} from "@/lib/course-utils";
import { InteractiveVideoPlayer } from "@/components/video/interactive-video-player";
import { createTranscriptFromScript } from "@/components/video/interactive-video-player";
import { parseVTT } from "@/lib/utils/vtt-parser";

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

	// Generate slugs for navigation
	const courseSlug = generateCourseSlug(course.id, course.title);

	// Handler for when quiz is completed (for future use/analytics)
	const handleQuizComplete = (passed: boolean, score: number) => {
		console.log("Quiz completed:", { passed, score, chapterId: chapter.id });
		// TODO: In production, update user progress in database
	};

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
		<div className="container mx-auto px-4 py-6 lg:px-6 xl:max-w-7xl">
			{/* Section Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">{section.title}</h1>
				<p className="text-muted-foreground">{section.learningObjective}</p>
			</div>

			<div className="bg-white border border-gray-200 rounded-lg p-4">
				{section.sectionType === "video" ? (
					<InteractiveVideoPlayer
						src={section.videoUrl}
						showTranscript={!!(section.videoVTT || section.videoScript)}
						transcript={
							section.videoVTT
								? parseVTT(section.videoVTT)
								: section.videoScript
									? createTranscriptFromScript(section.videoScript, 90)
									: []
						}
						layout="default"
						autoPlay={false}
						muted={false}
					/>
				) : section.sectionType === "quiz" ? (
					<ChapterQuiz
						quiz={{
							id: section.quiz!.id,
							title: section.quiz!.title,
							description: section.quiz!.description,
							questions: section.quiz!.questions,
							passingScore: section.quiz!.passingScore,
						}}
						chapterId={chapter.id}
						chapterTitle={chapter.title}
						onQuizComplete={handleQuizComplete}
					/>
				) : section.sectionType === "ai_avatar" ? (
					<div className="">
						<LearningCheckBase
							chapterId={chapter.id}
							chapterTitle={chapter.title}
						/>
					</div>
				) : (
					/* Default Layout for Other Section Types */
					<div className="mb-8">
						<div className="bg-white border border-gray-200 rounded-lg p-4">
							<p>Content for {section.sectionType} sections coming soon...</p>
						</div>
					</div>
				)}
			</div>

			{/* Navigation */}
			{nextSection && (
				<Button onClick={handleNextSection} className="mt-8">
					Next: {nextSection.title}
				</Button>
			)}
		</div>
	);
}
