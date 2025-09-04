"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

export type FeedPost = {
	id: string;
	user: {
		id: string;
		name: string;
		avatar?: string;
		role: string;
	};
	content: string;
	likes: number;
	comments: number;
	timeAgo: string;
};

export interface CommunityFeedProps {
	posts: FeedPost[];
	onPostSubmit?: (content: string) => void;
	onLike?: (postId: string) => void;
	onComment?: (postId: string) => void;
	onViewMore?: () => void;
	showTitle?: boolean;
	showViewMoreButton?: boolean;
}

// Define the form schema with Zod
const formSchema = z.object({
	content: z.string().min(1, "Post cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

export function CommunityFeed({
	posts,
	onPostSubmit,
	onLike,
	onComment,
	onViewMore,
	showTitle = true,
	showViewMoreButton = true,
}: CommunityFeedProps) {
	// Initialize React Hook Form with Zod validation
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
		},
	});

	// Handle form submission
	function onSubmit(data: FormValues) {
		if (onPostSubmit) {
			onPostSubmit(data.content);
			form.reset();
		}
	}

	return (
		<div className="space-y-4">
			{showTitle && <h3 className="text-lg font-medium">Community Feed</h3>}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Textarea
										placeholder="Share something with your peers..."
										className="min-h-[45px] resize-y rounded-lg"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex items-end">
						<Button variant="accent" type="submit" className="px-4 py-2 ">
							Post
						</Button>
					</div>
				</form>
			</Form>

			<div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
				{posts.map((post) => (
					<Card key={post.id} className="overflow-hidden">
						<CardHeader className="pb-2">
							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarImage src={post.user.avatar} alt={post.user.name} />
									<AvatarFallback>
										{post.user.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium">{post.user.name}</div>
									<div className="text-xs text-muted-foreground flex items-center">
										<span>{post.user.role}</span>
										<span className="mx-1">•</span>
										<span>{post.timeAgo}</span>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{post.content}</p>
						</CardContent>
						<CardFooter className="pt-0">
							<div className="flex items-center space-x-4 text-sm text-muted-foreground">
								<button
									onClick={() => onLike && onLike(post.id)}
									className="flex items-center space-x-1 hover:text-primary"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-thumbs-up"
									>
										<path d="M7 10v12" />
										<path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
									</svg>
									<span>{post.likes} Likes</span>
								</button>
								<button
									onClick={() => onComment && onComment(post.id)}
									className="flex items-center space-x-1 hover:text-primary"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-message-square"
									>
										<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
									</svg>
									<span>{post.comments} Comments</span>
								</button>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>

			{posts.length > 0 && showViewMoreButton && (
				<div className="flex justify-center">
					<Button variant="outline" onClick={onViewMore} className="w-full">
						View More Posts
					</Button>
				</div>
			)}
		</div>
	);
}
