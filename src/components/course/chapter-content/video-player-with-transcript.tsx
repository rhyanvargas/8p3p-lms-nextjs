"use client";

import { useState, useRef } from "react";
import { VideoPlayer, type VideoPlayerRef } from "./video-player";
import { InteractiveScript } from "./interactive-script";

interface VideoPlayerWithTranscriptProps {
	videoId?: string;
	script: string;
}

export function VideoPlayerWithTranscript({
	videoId = "section_1_1",
	script,
}: VideoPlayerWithTranscriptProps) {
	const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
		null
	);
	const videoPlayerRef = useRef<VideoPlayerRef>(null);

	const handleVideoElementReady = (element: HTMLVideoElement) => {
		setVideoElement(element);
	};

	return (
		<div className="flex gap-6">
			{/* Video Player - Left Side */}
			<div className="flex-auto w-[600px] p-4">
				<VideoPlayer
					ref={videoPlayerRef}
					videoId={videoId}
					onVideoElementReady={handleVideoElementReady}
				/>
			</div>

			{/* Transcript - Right Side */}
			<div className="flex-auto w-[300px] border-l border-gray-200">
				<div className="h-[400px] overflow-y-auto">
					<InteractiveScript
						className="p-0"
						script={script}
						videoElement={videoElement}
					/>
				</div>
			</div>
		</div>
	);
}
