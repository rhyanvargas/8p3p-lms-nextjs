"use client";

import Image from "next/image";
import { CourseCard } from "@/components/ui/course-card";
import { QuizResultsTable } from "@/components/ui/quiz-results-table";
import { CommunityFeed } from "@/components/ui/community-feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WidgetCard } from "@/components/ui/widget-card";
import { signOut } from "aws-amplify/auth";
import { Button } from "@/components/ui/button";

// Sample data
const courses = [
	{
		id: "1",
		title: "EMDR Therapy Fundamentals",
		description: "Learn the core principles and techniques of EMDR therapy.",
		progress: 65,
		imageUrl: "/emdr-xr-training.png",
		moduleCount: 8,
		completedModules: 5,
	},
	{
		id: "2",
		title: "Advanced EMDR Protocols",
		description: "Master specialized EMDR protocols for complex trauma cases.",
		progress: 30,
		imageUrl: "/emdr-xr-training.png",
		moduleCount: 10,
		completedModules: 3,
	},
];

const quizResults = [
	{
		id: "1",
		quiz: "EMDR Phase 1 Assessment",
		score: 92,
		status: "pass" as "pass",
		date: "2023-09-16",
	},
	{
		id: "2",
		quiz: "Trauma Processing Techniques",
		score: 88,
		status: "pass" as "pass",
		date: "2023-09-10",
	},
	{
		id: "3",
		quiz: "Client Safety Protocols",
		score: 95,
		status: "pass" as "pass",
		date: "2023-09-05",
	},
	{
		id: "4",
		quiz: "Advanced Bilateral Stimulation",
		score: 68,
		status: "fail" as "fail",
		date: "2023-08-28",
	},
];

const communityPosts = [
	{
		id: "1",
		user: {
			id: "101",
			name: "David Kim",
			avatar: "",
			role: "Student",
		},
		content:
			"I found the practice session really helpful today. The breakout rooms were a great way to practice the protocol with peers.",
		likes: 8,
		comments: 2,
		timeAgo: "3 hours ago",
	},
	{
		id: "2",
		user: {
			id: "102",
			name: "Lisa Wang",
			avatar: "",
			role: "Student",
		},
		content:
			"Has anyone found good resources for explaining EMDR to clients? I'd appreciate any recommendations!",
		likes: 15,
		comments: 7,
		timeAgo: "1 day ago",
	},
	{
		id: "3",
		user: {
			id: "103",
			name: "Michael Chen",
			avatar: "",
			role: "Practitioner",
		},
		content:
			"Just completed the advanced bilateral stimulation workshop. The VR demonstrations were incredibly insightful for understanding how to adapt techniques for telehealth. Would highly recommend to anyone interested in remote EMDR practice.",
		likes: 23,
		comments: 5,
		timeAgo: "2 days ago",
	},
];

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
						<CourseCard key={course.id} {...course} />
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
