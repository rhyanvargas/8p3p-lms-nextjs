"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TranscriptHeader } from "./transcript-header";
import { TranscriptSegment } from "./transcript-segment";
import {
	MediaSync,
	type TranscriptSegment as ITranscriptSegment,
} from "./media-sync";
import { cn } from "@/lib/utils";

interface InteractiveScriptProps {
	className?: string;
	script: string;
	videoElement?: HTMLVideoElement | null;
}

export function InteractiveScript({
	className,
	script,
	videoElement,
}: InteractiveScriptProps) {
	const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
	const [segments, setSegments] = useState<ITranscriptSegment[]>([]);
	const mediaSyncRef = useRef<MediaSync | null>(null);
	const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Initialize segments and MediaSync
	useEffect(() => {
		const parsedSegments = MediaSync.parseScriptToSegments(script);
		setSegments(parsedSegments);
		segmentRefs.current = new Array(parsedSegments.length);

		// Initialize MediaSync
		mediaSyncRef.current = new MediaSync(
			parsedSegments,
			(index, segment) => {
				setActiveSegmentIndex(index);
			},
			(index) => {
				// Scroll to segment
				const segmentElement = segmentRefs.current[index];
				if (segmentElement) {
					segmentElement.scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}
			}
		);

		return () => {
			if (mediaSyncRef.current) {
				mediaSyncRef.current.destroy();
			}
		};
	}, [script]);

	// Connect to video element when available
	useEffect(() => {
		if (videoElement && mediaSyncRef.current) {
			mediaSyncRef.current.init(videoElement);
		}
	}, [videoElement]);

	// Handle segment click
	const handleSegmentClick = (timestamp: string) => {
		if (mediaSyncRef.current) {
			mediaSyncRef.current.seekToTimestamp(timestamp);
		}
	};

	return (
		<Card className="shadow-none border-none rounded-none">
			<CardContent className="p-0">
				<TranscriptHeader
					className={cn("p-2 backdrop-blur-lg bg-muted/50")}
					title="Transcript"
					script={script}
				/>

				<div className="space-y-2 p-2">
					{segments.map((segment, index) => (
						<div
							key={index}
							ref={(el) => {
								segmentRefs.current[index] = el;
							}}
						>
							<TranscriptSegment
								timestamp={segment.timestamp}
								text={segment.text}
								isActive={index === activeSegmentIndex}
								onClick={handleSegmentClick}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
