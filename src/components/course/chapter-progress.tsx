"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChapterProgressProps {
	progress: number; // 0 to 100
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function ChapterProgress({
	progress,
	size = "md",
	className,
}: ChapterProgressProps) {
	// Calculate circle dimensions based on size
	const dimensions = {
		sm: {
			size: 16,
			strokeWidth: 2,
		},
		md: {
			size: 24,
			strokeWidth: 2.5,
		},
		lg: {
			size: 32,
			strokeWidth: 3,
		},
	};

	const { size: circleSize, strokeWidth } = dimensions[size];
	const radius = (circleSize - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (progress / 100) * circumference;
	const isComplete = progress >= 100;

	return (
		<div
			className={cn(
				"relative inline-flex items-center justify-center",
				className
			)}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={progress}
			role="progressbar"
			aria-label={`Chapter progress: ${progress}%`}
		>
			<svg
				width={circleSize}
				height={circleSize}
				viewBox={`0 0 ${circleSize} ${circleSize}`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* Background circle */}
				<circle
					cx={circleSize / 2}
					cy={circleSize / 2}
					r={radius}
					className={progress === 0 ? "stroke-accent/30" : "stroke-accent/50"}
					strokeWidth={strokeWidth}
				/>

				{/* Progress circle */}
				{!isComplete && progress > 0 && (
					<circle
						cx={circleSize / 2}
						cy={circleSize / 2}
						r={radius}
						className="stroke-accent"
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
					/>
				)}

				{/* Checkmark for completed chapters */}
				{isComplete && (
					<circle
						cx={circleSize / 2}
						cy={circleSize / 2}
						r={radius}
						className="fill-accent stroke-brand-light-blue"
					/>
				)}
			</svg>

			{/* Checkmark icon when complete */}
			{isComplete && (
				<Check
					className={cn(
						"absolute text-primary-foreground",
						size === "sm" && "h-2.5 w-2.5",
						size === "md" && "h-3.5 w-3.5",
						size === "lg" && "h-5 w-5"
					)}
				/>
			)}
		</div>
	);
}
