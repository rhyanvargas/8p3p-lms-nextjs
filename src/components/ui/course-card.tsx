"use client";

import Image from "next/image";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface CourseCardProps {
	id: string;
	title: string;
	description: string;
	progress: number;
	imageUrl?: string;
	duration?: string;
	totalChapters: number;
	completedChapters: number;
}

export function CourseCard({
	id,
	title,
	description,
	progress,
	imageUrl = "/emdr-xr-training.png",
	duration,
	totalChapters,
	completedChapters,
}: CourseCardProps) {
	return (
		<Card className="overflow-hidden pt-0">
			<div className="relative h-48 w-full">
				<Image
					src={imageUrl}
					alt={title}
					fill
					className="object-coverw-full h-full object-cover transition-transform duration-300 hover:scale-105"
					priority
					loading="eager"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
			</div>
			<CardHeader>
				<CardTitle className="text-xl">{title}</CardTitle>
				<p className="text-sm text-muted-foreground">{description}</p>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex justify-between items-center">
					<span className="text-sm font-medium">Progress</span>
					<span className="text-sm text-muted-foreground">{progress}%</span>
				</div>
				<Progress value={progress} className="h-2" />
			</CardContent>
			<CardFooter className="flex justify-between">
				<div className="text-sm text-muted-foreground">
					{completedChapters}/{totalChapters} chapters • {duration}
				</div>
				<Button variant="accent">Continue</Button>
			</CardFooter>
		</Card>
	);
}
