"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChapterProgress } from "@/components/course/chapter-progress";
import { Course } from "@/lib/mock-data";
import {
	generateCourseSlug,
	generateSectionSlug,
	generateChapterSlug,
	isChapterCompletedObj,
	calculateCourseProgress,
} from "@/lib/course-utils";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
	course: Course;
	activeChapterId?: string;
}

export function CourseSidebar({
	course,
	activeChapterId,
	className,
	...props
}: CourseSidebarProps) {
	// Access sidebar state to determine if collapsed
	useSidebar(); // Access sidebar context

	// Get current path to determine active items
	const pathname = usePathname();

	// Generate course slug for links
	const courseSlug = generateCourseSlug(course.id, course.title);

	// Check if we're on the overview page
	const isOverviewActive = pathname === `/courses/${courseSlug}`;

	// Helper function to get chapter progress using the utility function
	const getChapterProgress = (chapterId: string) => {
		return isChapterCompletedObj(course, chapterId) ? 100 : 0;
	};

	// Track open sections
	const [openModules, setOpenModules] = useState<string[]>([
		course.sections[0]?.id || "",
	]);

	// Auto-expand section containing active chapter
	useEffect(() => {
		const activeSection = course.sections.find((section) =>
			section.chapters.some(
				(chapter) =>
					pathname.includes(generateChapterSlug(chapter.id, chapter.title)) ||
					chapter.id === activeChapterId
			)
		);
		if (activeSection && !openModules.includes(activeSection.id)) {
			setOpenModules((prev) => [...prev, activeSection.id]);
		}
	}, [pathname, course.sections, openModules]);

	const toggleModule = (moduleId: string) => {
		setOpenModules((prev) =>
			prev.includes(moduleId)
				? prev.filter((id) => id !== moduleId)
				: [...prev, moduleId]
		);
	};

	return (
		<Sidebar
			collapsible="offcanvas"
			className={cn("overflow-hidden", className)}
			{...props}
		>
			<SidebarHeader className="p-4 border-b border-border bg-muted/30">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<h2 className="font-semibold text-lg text-foreground wrap-break-word">
							{course.title}
						</h2>
						<p className="text-sm text-muted-foreground truncate">
							{course.duration}
						</p>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="py-2 group-data-[collapsible=icon]:hidden ">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="space-y-1">
							{/* Overview Link */}
							<SidebarMenuItem>
								<Link href={`/courses/${courseSlug}`} passHref>
									<SidebarMenuButton
										className={cn(
											"w-full px-4 py-2.5 h-auto text-left font-medium flex items-center gap-2",
											isOverviewActive
												? "bg-primary text-primary-foreground"
												: ""
										)}
									>
										<BookOpen className="h-4 w-4" />
										<span>Course Overview</span>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>

							{/* Divider */}
							<div className="h-px bg-border my-2" />
							{course.sections.map((section) => (
								<Collapsible
									key={section.id}
									open={openModules.includes(section.id)}
									onOpenChange={() => toggleModule(section.id)}
								>
									<SidebarMenuItem className="rounded-md group/chapter-item">
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className="w-full justify-between px-4 py-2.5 h-auto text-left font-medium">
												<span>{section.title}</span>
												{openModules.includes(section.id) ? (
													<ChevronUp className="h-4 w-4 opacity-70" />
												) : (
													<ChevronDown className="h-4 w-4 opacity-70" />
												)}
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub className="space-y-0.5 ml-3 mt-1 border-l border-sidebar-primary pl-3">
												{section.chapters.map((chapter) => {
													const sectionSlug = generateSectionSlug(
														section.id,
														section.title
													);
													const chapterSlug = generateChapterSlug(
														chapter.id,
														chapter.title
													);
													const chapterUrl = `/courses/${courseSlug}/${sectionSlug}/chapters/${chapterSlug}`;
													const isActive = pathname.includes(chapterSlug);

													return (
														<SidebarMenuSubItem key={chapter.id}>
															<Link href={chapterUrl}>
																<SidebarMenuSubButton
																	isActive={isActive}
																	className="w-full justify-between px-2 py-1.5 h-auto text-left rounded-md"
																>
																	<div className="flex-1 min-w-0">
																		<p className="text-sm truncate">
																			{chapter.title}
																		</p>
																	</div>
																	<ChapterProgress
																		progress={getChapterProgress(chapter.id)}
																		size="sm"
																	/>
																</SidebarMenuSubButton>
															</Link>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="p-4 border-t border-border">
				<div className="text-xs text-muted-foreground">
					<p>Course progress: {calculateCourseProgress(course)}%</p>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
