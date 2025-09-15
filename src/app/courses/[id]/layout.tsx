"use client";

import { useParams } from "@/hooks/use-params";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { LayoutBreadcrumbs } from "@/components/course/layout-breadcrumbs";
import { Navbar } from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCourseBySlug } from "@/lib/course-utils";

interface CourseLayoutProps {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}

export default function CourseLayout({ children, params }: CourseLayoutProps) {
	const { id } = useParams(params);
	const course = getCourseBySlug(id);
	return (
		<>
			<Navbar />

			<SidebarProvider>
				{course && <CourseSidebar course={course} className="" />}
				<SidebarInset className="flex flex-col min-h-screen">
					<header className="sticky top-[var(--header-height)] z-50 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 backdrop-blur-lg bg-background/80 border-b">
						<div className="flex items-center gap-2 px-4 w-full">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>
							{course && <LayoutBreadcrumbs course={course} />}
						</div>
					</header>
					<main className="flex flex-1 flex-col gap-4 p-4 pt-0">
						{children}
					</main>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
