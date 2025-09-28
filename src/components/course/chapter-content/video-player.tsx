"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import Video from "next-video";

// Import video files directly for next-video
import introVideo from "/videos/Intro-8p3p-Ch1-Section-1-1.mp4";
import howEmdrWorksVideo from "/videos/How EMDR Works-8p3p-Ch1-Section-1-2.mp4";
import traumaAndBodyVideo from "/videos/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4";
import closingVideo from "/videos/Closing-8p3p-Ch1-Section-1-4.mp4";

interface VideoPlayerProps {
	videoId?: string;
	className?: string;
	onVideoElementReady?: (videoElement: HTMLVideoElement) => void;
}

export interface VideoPlayerRef {
	getVideoElement: () => HTMLVideoElement | null;
}

// Video mapping - now using section IDs
const videoMap = {
	section_1_1: introVideo,
	section_1_2: howEmdrWorksVideo,
	section_1_3: traumaAndBodyVideo,
	section_1_4: closingVideo,
};

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
	videoId = "section_1_1",
	className = "",
	onVideoElementReady,
}, ref) => {
	const videoSrc = videoMap[videoId as keyof typeof videoMap] || introVideo;
	const containerRef = useRef<HTMLDivElement>(null);
	const videoElementRef = useRef<HTMLVideoElement | null>(null);

	useImperativeHandle(ref, () => ({
		getVideoElement: () => videoElementRef.current,
	}));

	useEffect(() => {
		// Find the video element after Next Video renders
		const findVideoElement = () => {
			if (containerRef.current) {
				const videoElement = containerRef.current.querySelector('video') as HTMLVideoElement;
				if (videoElement && videoElement !== videoElementRef.current) {
					videoElementRef.current = videoElement;
					if (onVideoElementReady) {
						onVideoElementReady(videoElement);
					}
				}
			}
		};

		// Try to find video element immediately
		findVideoElement();

		// Also try after a short delay in case Next Video hasn't rendered yet
		const timeout = setTimeout(findVideoElement, 100);

		// Set up a MutationObserver to detect when the video element is added
		const observer = new MutationObserver(findVideoElement);
		if (containerRef.current) {
			observer.observe(containerRef.current, { childList: true, subtree: true });
		}

		return () => {
			clearTimeout(timeout);
			observer.disconnect();
		};
	}, [onVideoElementReady, videoSrc]);

	return (
		<div className={`${className}`} ref={containerRef}>
			<Video
				src={videoSrc}
				controls
				className="w-full aspect-video rounded-lg"
			/>
		</div>
	);
});

VideoPlayer.displayName = "VideoPlayer";
