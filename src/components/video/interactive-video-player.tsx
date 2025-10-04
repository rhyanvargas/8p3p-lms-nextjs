"use client";

import { useState, useEffect } from "react";
import { VideoPlayer, useVideoPlayerRef } from "./video-player";
import { TranscriptPanel } from "./transcript-panel";
import { cn } from "@/lib/utils";
import { scriptToTranscript } from "@/lib/utils/vtt-parser";

/**
 * Utility function to convert a script text into basic transcript segments
 * @deprecated Use parseVTT for VTT content or scriptToTranscript for plain text
 */
export function createTranscriptFromScript(
	script: string,
	segmentDuration: number = 10
): TranscriptSegment[] {
	return scriptToTranscript(script, segmentDuration);
}

export interface TranscriptSegment {
	id: string;
	startTime: number;
	endTime: number;
	text: string;
}

export interface InteractiveVideoPlayerProps {
	/** Video source - can be local file path, remote URL, or next-video Asset */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	/** Callback when video ends (currently not implemented) */
	_onVideoEnd?: () => void;
	/** Callback when video starts playing (currently not implemented) */
	_onPlay?: () => void;
	/** Callback when video pauses (currently not implemented) */
	_onPause?: () => void;
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
	_onVideoEnd,
	_onPlay,
	_onPause,
}: InteractiveVideoPlayerProps) {
	const [currentTime, setCurrentTime] = useState(0);
	const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
	const [videoRef, playerRef] = useVideoPlayerRef();

	// Find active segment based on current time
	useEffect(() => {
		if (transcript.length === 0) return;

		const activeSegment = transcript.find(
			(segment: TranscriptSegment) =>
				currentTime >= segment.startTime && currentTime < segment.endTime
		);

		setActiveSegmentId(activeSegment?.id || null);
	}, [currentTime, transcript]);

	const handleSeekToTime = (time: number) => {
		// Seek video to the specified time
		playerRef.seekTo(time);
		setCurrentTime(time);
	};

	const handleTimeUpdate = (newTime: number) => {
		setCurrentTime(newTime);
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
					ref={videoRef}
					src={src}
					poster={poster}
					autoPlay={autoPlay}
					muted={muted}
					controls={true}
					className="w-full aspect-video rounded-lg overflow-hidden"
					onTimeUpdate={handleTimeUpdate}
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
