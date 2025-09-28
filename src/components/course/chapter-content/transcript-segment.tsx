"use client";

import { cn } from "@/lib/utils";

interface TranscriptSegmentProps {
	timestamp: string;
	text: string;
	isActive?: boolean;
	onClick?: (timestamp: string) => void;
}

export function TranscriptSegment({
	timestamp,
	text,
	isActive = false,
	onClick,
}: TranscriptSegmentProps) {
	const handleClick = () => {
		if (onClick) {
			onClick(timestamp);
		}
	};

	return (
		<div
			className={cn(
				"flex gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50 shadow-sm",
				isActive && "bg-primary/10 border-l-2 border-primary"
			)}
			onClick={handleClick}
		>
			{/* Timestamp */}
			<div
				className={cn(
					"text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground min-w-[3rem] text-center",
					isActive && "bg-primary text-primary-foreground"
				)}
			>
				{timestamp}
			</div>

			{/* Text Content */}
			<div
				className={cn(
					"text-sm text-muted-foreground flex-1 leading-relaxed",
					isActive && "text-foreground font-medium"
				)}
			>
				{text}
			</div>
		</div>
	);
}
