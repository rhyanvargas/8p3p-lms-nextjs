"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

interface AskQuestionProps {
	chapterTitle: string;
	chapterId?: string;
}

export function AskQuestion({ chapterTitle, chapterId }: AskQuestionProps) {
	const handleQuestionClick = () => {
		// Track question interaction
		if (chapterId) {
			console.log(`Question asked for chapter: ${chapterId}`);
			// TODO: Implement actual tracking logic
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="accent"
					className="flex items-center gap-2"
					onClick={handleQuestionClick}
				>
					<HelpCircle className="h-4 w-4" />
					Ask a Question
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ask a Question about "{chapterTitle}"</DialogTitle>
					<DialogDescription>
						Get help with this chapter content from our AI assistant.
					</DialogDescription>
				</DialogHeader>
				<div className="py-6 text-center text-lg font-medium text-muted-foreground bg-primary/10 rounded-lg h-64 w-full flex items-center justify-center">
					TAVUS CONVERSATIONAL AI EMBED GOES HERE
				</div>
			</DialogContent>
		</Dialog>
	);
}
