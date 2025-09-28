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
	activeChapterId: _activeChapterId,
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

	// Track open chapters
	const [openModules, setOpenModules] = useState<string[]>([
		course.chapters[0]?.id || "",
	]);

	// Auto-expand chapter containing active section
	useEffect(() => {
		const activeChapter = course.chapters.find((chapter) =>
			chapter.sections.some(
				(section) =>
					pathname.includes(generateSectionSlug(section.id, section.title))
			)
		);
		if (activeChapter) {
			setOpenModules([activeChapter.id]);
		}
	}, [pathname, course.chapters]);

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
							{course.chapters.map((chapter) => (
								<Collapsible
									key={chapter.id}
									open={openModules.includes(chapter.id)}
									onOpenChange={() => toggleModule(chapter.id)}
								>
									<SidebarMenuItem className="rounded-md group/chapter-item">
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className="w-full justify-between px-4 py-2.5 h-auto text-left font-medium">
												<span>{chapter.title}</span>
												{openModules.includes(chapter.id) ? (
													<ChevronUp className="h-4 w-4 opacity-70" />
												) : (
													<ChevronDown className="h-4 w-4 opacity-70" />
												)}
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub className="space-y-0.5 ml-3 mt-1 border-l border-sidebar-primary pl-3">
												{chapter.sections.map((section) => {
													const chapterSlug = generateChapterSlug(
														chapter.id,
														chapter.title
													);
													const sectionSlug = generateSectionSlug(
														section.id,
														section.title
													);
													const sectionUrl = `/courses/${courseSlug}/${chapterSlug}/sections/${sectionSlug}`;
													const isActive = pathname.includes(sectionSlug);

													return (
														<SidebarMenuSubItem key={section.id}>
															<Link href={sectionUrl}>
																<SidebarMenuSubButton
																	asChild
																	isActive={isActive}
																	className="w-full justify-between px-2 py-2 h-auto text-left rounded-md"
																>
																	<span className="flex w-full justify-between items-center">
																		<div className="flex-1 min-w-0">
																			<p className="text-sm truncate">
																				{section.title}
																			</p>
																		</div>
																		<ChapterProgress
																			progress={getChapterProgress(section.id)}
																			size="sm"
																		/>
																	</span>
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
