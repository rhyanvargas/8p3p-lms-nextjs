"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

interface InteractiveScriptProps {
	script: string;
}

export function InteractiveScript({ script }: InteractiveScriptProps) {
	const [copied, setCopied] = useState(false);
	const [expanded, setExpanded] = useState(false);

	// Split script into paragraphs
	const paragraphs = script.split("\n\n").filter((p) => p.trim().length > 0);

	// Display only first 3 paragraphs if not expanded
	const displayParagraphs = expanded ? paragraphs : paragraphs.slice(0, 3);

	// Copy script to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(script);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">0:00</h3>
					<Button
						variant="ghost"
						size="sm"
						className="flex items-center gap-1"
						onClick={copyToClipboard}
					>
						{copied ? (
							<>
								<Check className="h-4 w-4" />
								<span>Copied</span>
							</>
						) : (
							<>
								<Copy className="h-4 w-4" />
								<span>Copy</span>
							</>
						)}
					</Button>
				</div>

				<div className="space-y-4 text-muted-foreground">
					{displayParagraphs.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}

					{paragraphs.length > 3 && !expanded && (
						<div className="pt-2">
							<Button variant="ghost" onClick={() => setExpanded(true)}>
								Show More
							</Button>
						</div>
					)}

					{expanded && (
						<div className="pt-2">
							<Button variant="ghost" onClick={() => setExpanded(false)}>
								Show Less
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
