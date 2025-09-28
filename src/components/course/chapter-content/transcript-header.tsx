"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptHeaderProps {
	title?: string;
	script: string;
	className?: string;
}

export function TranscriptHeader({
	className,
	title = "Transcript",
	script,
}: TranscriptHeaderProps) {
	const [copied, setCopied] = useState(false);

	// Copy script to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(script);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={cn(
				"flex justify-between items-center mb-4 sticky top-0 z-10  border-b pb-2",
				className
			)}
		>
			<h3 className="text-lg font-semibold">{title}</h3>
			<Button
				variant="ghost"
				size="sm"
				className="flex items-center gap-1"
				onClick={copyToClipboard}
			>
				{copied ? (
					<>
						<Check className="h-4 w-4" />
						<span className="text-sm">Copied</span>
					</>
				) : (
					<>
						<Copy className="h-4 w-4" />
						<span className="text-sm">Copy</span>
					</>
				)}
			</Button>
		</div>
	);
}
