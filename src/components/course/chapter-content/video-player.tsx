"use client";

import Video from "next-video";

// Import video files directly for next-video
import introVideo from "/videos/Intro-8p3p-Ch1-Section-1-1.mp4";
import howEmdrWorksVideo from "/videos/How EMDR Works-8p3p-Ch1-Section-1-2.mp4";
import traumaAndBodyVideo from "/videos/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4";
import closingVideo from "/videos/Closing-8p3p-Ch1-Section-1-4.mp4";

interface VideoPlayerProps {
	videoId?: string;
	className?: string;
	transcript?: string;
}

// Video mapping - now using section IDs
const videoMap = {
	section_1_1: introVideo,
	section_1_2: howEmdrWorksVideo,
	section_1_3: traumaAndBodyVideo,
	section_1_4: closingVideo,
};


export function VideoPlayer({
	videoId = "section_1_1",
	className = "",
	transcript = "",
}: VideoPlayerProps) {
	const videoSrc = videoMap[videoId as keyof typeof videoMap] || introVideo;

	return (
		<div className={`${className}`}>
			<Video
				src={videoSrc}
				controls
				className="w-full aspect-video rounded-lg"
			/>
		</div>
	);
}
