import Video from "next-video";

// Import video files directly for next-video
import introVideo from "/videos/Intro-8p3p-Ch1-Section-1-1.mp4";
import howEmdrWorksVideo from "/videos/How EMDR Works-8p3p-Ch1-Section-1-2.mp4";
import traumaAndBodyVideo from "/videos/Trauma and the Body-8p3p-Ch1-Section-1-3.mp4";
import closingVideo from "/videos/Closing-8p3p-Ch1-Section-1-4.mp4";
interface VideoPlayerProps {
	videoId?: string;
	className?: string;
}

// Video mapping - now using section IDs
const videoMap = {
	section_1_1: introVideo,
	section_1_2: howEmdrWorksVideo,
	section_1_3: traumaAndBodyVideo,
	section_1_4: closingVideo,
	// Additional sections can be added here
	// section_1_1: introVideo, (alternative mapping if needed)
};

export function VideoPlayer({
	videoId = "section_1_1",
	className = "",
}: VideoPlayerProps) {
	return (
		<div className={`rounded-lg overflow-hidden ${className}`}>
			<Video
				src={videoMap[videoId as keyof typeof videoMap] || introVideo}
				className="w-full aspect-video"
			/>
		</div>
	);
}
