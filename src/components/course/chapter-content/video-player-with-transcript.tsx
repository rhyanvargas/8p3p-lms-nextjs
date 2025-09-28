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
			<div className="flex-auto w-[600px]">
				<VideoPlayer
					ref={videoPlayerRef}
					videoId={videoId}
					onVideoElementReady={handleVideoElementReady}
				/>
			</div>

			<div className="flex-auto w-[300px] border-l border-gray-200 pl-6">
				<div className="h-[400px] overflow-y-auto">
					<InteractiveScript
						script={script}
						videoElement={videoElement}
					/>
				</div>
			</div>
		</div>
	);
}
