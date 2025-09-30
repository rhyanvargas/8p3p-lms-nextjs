"use client";

import { useState, useEffect } from "react";
import { VideoPlayer, useVideoPlayerRef } from "./video";
import { TranscriptPanel } from "./transcript-panel";
import { cn } from "@/lib/utils";

/**
 * Utility function to convert a script text into basic transcript segments
 * This is a simple implementation - in production you'd want more sophisticated parsing
 */
export function createTranscriptFromScript(script: string, videoDuration = 60): TranscriptSegment[] {
	if (!script) return [];
	
	// Split script into sentences and create segments
	const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
	const segmentDuration = videoDuration / sentences.length;
	
	return sentences.map((sentence, index) => ({
		id: `segment-${index + 1}`,
		startTime: index * segmentDuration,
		endTime: (index + 1) * segmentDuration,
		text: sentence.trim() + (index < sentences.length - 1 ? '.' : ''),
	}));
}

export interface TranscriptSegment {
	id: string;
	startTime: number;
	endTime: number;
	text: string;
}

export interface InteractiveVideoPlayerProps {
	/** Video source - can be local file path, remote URL, or next-video Asset */
	src: string | any; // Asset type from next-video
	/** Video poster/thumbnail URL */
	poster?: string;
	/** Transcript segments for interactive functionality */
	transcript?: TranscriptSegment[];
	/** Show transcript panel */
	showTranscript?: boolean;
	/** Custom className for the container */
	className?: string;
	/** Layout variant */
	layout?: "default" | "theater" | "compact";
	/** Auto-play video */
	autoPlay?: boolean;
	/** Muted by default */
	muted?: boolean;
	/** Show video controls */
	controls?: boolean;
	/** Callback when video time updates */
	onTimeUpdate?: (currentTime: number) => void;
	/** Callback when video ends */
	onVideoEnd?: () => void;
	/** Callback when video starts playing */
	onPlay?: () => void;
	/** Callback when video pauses */
	onPause?: () => void;
}

export function InteractiveVideoPlayer({
	src,
	poster,
	transcript = [],
	showTranscript = true,
	className,
	layout = "default",
	autoPlay = false,
	muted = false,
	controls = true,
	onTimeUpdate,
	onVideoEnd,
	onPlay,
	onPause,
}: InteractiveVideoPlayerProps) {
	const [currentTime, setCurrentTime] = useState(0);
	const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
	const [_videoRef, playerRef] = useVideoPlayerRef();

	// Find active segment based on current time
	useEffect(() => {
		if (transcript.length === 0) return;
		
		const activeSegment = transcript.find(
			(segment: TranscriptSegment) =>
				currentTime >= segment.startTime && currentTime < segment.endTime
		);
		setActiveSegmentId(activeSegment?.id || null);
	}, [currentTime, transcript]);

	const handleTimeUpdate = (newTime: number) => {
		setCurrentTime(newTime);
		onTimeUpdate?.(newTime);
	};

	const handleSeekToTime = (time: number) => {
		playerRef.setCurrentTime(time);
		setCurrentTime(time);
	};

	const handleVideoEnd = () => {
		onVideoEnd?.();
	};

	const handlePlay = () => {
		onPlay?.();
	};

	const handlePause = () => {
		onPause?.();
	};

	// Layout configurations
	const layoutClasses = {
		default: "grid lg:grid-cols-3 gap-8",
		theater: "grid grid-cols-1 gap-6",
		compact: "grid grid-cols-1 lg:grid-cols-2 gap-4",
	};

	const videoColSpan = {
		default: "lg:col-span-2",
		theater: "col-span-1",
		compact: "lg:col-span-1",
	};

	const transcriptColSpan = {
		default: "lg:col-span-1",
		theater: "col-span-1",
		compact: "lg:col-span-1",
	};

	return (
		<div className={cn(layoutClasses[layout], className)}>
			<div className={videoColSpan[layout]}>
				<VideoPlayer
					src={src}
					poster={poster}
					autoPlay={autoPlay}
					muted={muted}
					controls={controls}
					className="w-full aspect-video rounded-lg overflow-hidden"
					onTimeUpdate={handleTimeUpdate}
					onEnded={handleVideoEnd}
					onPlay={handlePlay}
					onPause={handlePause}
				/>
			</div>
			{showTranscript && transcript.length > 0 && (
				<div className={transcriptColSpan[layout]}>
					<TranscriptPanel
						transcript={transcript}
						activeSegmentId={activeSegmentId}
						currentTime={currentTime}
						onSeekToTime={handleSeekToTime}
					/>
				</div>
			)}
		</div>
	);
}
