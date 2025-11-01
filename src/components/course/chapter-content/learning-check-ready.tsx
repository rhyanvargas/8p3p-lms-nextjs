import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const LearningCheckReadyScreen = ({
	chapterTitle,
	isLoading,
	handleOnStart,
}: {
	chapterTitle: string;
	isLoading: boolean;
	handleOnStart: () => void;
}) => {
	return (
		<Card className="shadow-none">
			<CardHeader className="p-2">
				<CardTitle>{chapterTitle}</CardTitle>
				<CardDescription className="text-muted-foreground">
					Have a 3-minute conversation with your AI instructor to demonstrate
					your understanding of this chapter.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-8">
				<div className="space-y-2">
					<h4 className="font-semibold">What to expect:</h4>
					<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
						<li>3-minute conversation with AI avatar</li>
						<li>Questions about recall, application, and self-explanation</li>
						<li>Must engage for at least 90 seconds (50%) to complete</li>
						<li>Camera and microphone required</li>
					</ul>
				</div>

				<Button onClick={handleOnStart} disabled={isLoading} className="w-full">
					Start Learning Check
				</Button>
			</CardContent>
		</Card>
	);
};
