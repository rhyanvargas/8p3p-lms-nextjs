"use client";

import { CourseCard } from "@/components/ui/course-card";
import { QuizResultsTable } from "@/components/ui/quiz-results-table";
import { CommunityFeed } from "@/components/ui/community-feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WidgetCard } from "@/components/ui/widget-card";

// Import mock data from centralized location
import { courses, quizResults, communityPosts } from "@/lib/mock-data";
import { getTotalChapters, getCompletedChapters } from "@/lib/course-utils";

export default function Page() {
	return (
		<div className="container mx-auto py-8 px-4">
			{/* Header Section */}
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-2xl font-bold">Welcome back, Sarah Johnson</h1>
					<p className="text-muted-foreground">
						Continue your EMDR training journey where you left off.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12 border-2 border-primary">
						<AvatarImage
							src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
							alt="Sarah Johnson"
						/>
						<AvatarFallback>SJ</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">Sarah Johnson</p>
						<p className="text-sm text-muted-foreground">Student</p>
					</div>
				</div>
			</div>

			{/* Courses Section */}
			<section className="mb-10">
				<h2 className="text-xl font-semibold mb-4">Your Courses</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{courses.map((course) => (
						<CourseCard 
							key={course.id}
							id={course.id}
							title={course.title}
							description={course.description}
							progress={course.progress}
							imageUrl={course.imageUrl}
							duration={course.duration}
							totalChapters={getTotalChapters(course.id)}
							completedChapters={getCompletedChapters(course.id)}
						/>
					))}
				</div>
			</section>

			{/* Dashboard Widgets */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Quiz Results */}
				<WidgetCard
					title="Recent Quiz Results"
					showViewAll={true}
					onViewAll={() => console.log("View all results clicked")}
				>
					<div className="">
						<QuizResultsTable results={quizResults} showViewAll={false} />
					</div>
				</WidgetCard>

				{/* Community Feed */}
				<WidgetCard
					title="Community Feed"
					showViewAll={true}
					onViewAll={() => console.log("View more posts clicked")}
				>
					<CommunityFeed
						posts={communityPosts}
						onPostSubmit={(content) => console.log("New post:", content)}
						onLike={(postId) => console.log("Liked post:", postId)}
						onComment={(postId) => console.log("Comment on post:", postId)}
						onViewMore={() => console.log("View more posts clicked")}
						showTitle={false}
						showViewMoreButton={false}
					/>
				</WidgetCard>
			</div>
		</div>
	);
}
