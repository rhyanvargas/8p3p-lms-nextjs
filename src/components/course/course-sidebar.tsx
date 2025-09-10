"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronDown, ChevronUp, Menu, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChapterProgress } from "@/components/course/chapter-progress";
import { mockCourses } from "@/lib/mock-data";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
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
import { Button } from "@/components/ui/button";

// Mock progress data - in a real app, this would come from user progress tracking
const chapterProgress = {
	chapter_1_1: 100,
	chapter_1_2: 100,
	chapter_1_3: 65,
	chapter_2_1: 40,
	chapter_2_2: 0,
	chapter_2_3: 0,
	chapter_3_1: 0,
	chapter_3_2: 0,
	chapter_4_1: 0,
	chapter_4_2: 0,
};

// Helper function to get chapter progress
const getChapterProgress = (chapterId: string) => {
	return chapterProgress[chapterId as keyof typeof chapterProgress] || 0;
};

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
	// Add any additional props here
}

export function CourseSidebar({ className, ...props }: CourseSidebarProps) {
	// Access sidebar state to determine if collapsed
	const { state, toggleSidebar } = useSidebar();
	const isCollapsed = state === "collapsed";

	// Use the course data from mock-data.ts
	const course = mockCourses.course;

	// Track open modules and active chapter
	const [openModules, setOpenModules] = useState<string[]>(["module_1"]);
	const [activeChapter, setActiveChapter] = useState("chapter_1_1");

	const toggleModule = (moduleId: string) => {
		setOpenModules((prev) =>
			prev.includes(moduleId)
				? prev.filter((id) => id !== moduleId)
				: [...prev, moduleId]
		);
	};

	return (
		<Sidebar
			collapsible="icon"
			className={cn("overflow-hidden", className)}
			{...props}
		>
			<SidebarHeader className="p-4 border-b border-border bg-muted/30">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<h2 className="font-semibold text-lg text-foreground truncate">
							{course.title}
						</h2>
						<p className="text-sm text-muted-foreground truncate">
							{course.level}
						</p>
					</div>
					{/* Toggle button with conditional icon */}
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
						className="ml-2 shrink-0"
					>
						{isCollapsed ? (
							<Menu className="h-4 w-4" />
						) : (
							<ArrowLeft className="h-4 w-4" />
						)}
					</Button>
				</div>
			</SidebarHeader>

			<SidebarContent className="py-2 group-data-[collapsible=icon]:hidden">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="space-y-1">
							{course.modules.map((module) => (
								<Collapsible
									key={module.id}
									open={openModules.includes(module.id)}
									onOpenChange={() => toggleModule(module.id)}
								>
									<SidebarMenuItem className="rounded-md group/chapter-item">
										<CollapsibleTrigger asChild>
											<SidebarMenuButton className="w-full justify-between px-4 py-2.5 h-auto text-left font-medium">
												<span>{module.title}</span>
												{openModules.includes(module.id) ? (
													<ChevronUp className="h-4 w-4 opacity-70" />
												) : (
													<ChevronDown className="h-4 w-4 opacity-70" />
												)}
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub className="space-y-0.5 ml-3 mt-1 border-l border-sidebar-primary pl-3">
												{module.chapters.map((chapter) => (
													<SidebarMenuSubItem key={chapter.id}>
														<SidebarMenuSubButton
															isActive={activeChapter === chapter.id}
															onClick={() => setActiveChapter(chapter.id)}
															className={cn(
																"w-full justify-between px-2 py-1.5 h-auto text-left rounded-md hover:bg-primary/10", // Changed to justify-between
																activeChapter === chapter.id ? "bg-primary" : ""
															)}
														>
															{/* Chapter title on the left */}
															<div className="flex-1 min-w-0">
																<p className="text-sm truncate">
																	{chapter.title}
																</p>
															</div>

															{/* Chapter progress indicator on the right */}
															<ChapterProgress
																progress={getChapterProgress(chapter.id)}
																size="sm"
															/>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
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
					<p>Course progress: 25%</p>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
