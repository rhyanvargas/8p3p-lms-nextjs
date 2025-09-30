"use client";

import { useRef, useEffect } from "react";
import Video from "next-video";
import { cn } from "@/lib/utils";

/**
 * Provider-agnostic VideoPlayer component using next-video
 * 
 * This component abstracts away the video provider (Mux, Vercel Blob, AWS S3, etc.)
 * and provides a consistent interface for video playback with transcript synchronization.
 * 
 * @example
 * ```tsx
 * <VideoPlayer
 *   src="/videos/my-video.mp4"
 *   onTimeUpdate={(time) => console.log('Current time:', time)}
 *   onPlay={() => console.log('Video started')}
 * />
 * ```
 */

export interface VideoPlayerProps {
  /** Video source - can be local file path, remote URL, or next-video Asset */
  src: string | any; // Asset type from next-video
  /** Poster image URL */
  poster?: string;
  /** Auto-play video on load */
  autoPlay?: boolean;
  /** Start muted */
  muted?: boolean;
  /** Show video controls */
  controls?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Video width */
  width?: string | number;
  /** Video height */
  height?: string | number;
  /** Callback when video time updates */
  onTimeUpdate?: (currentTime: number) => void;
  /** Callback when video starts playing */
  onPlay?: () => void;
  /** Callback when video pauses */
  onPause?: () => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback when video is ready to play */
  onLoadedData?: () => void;
  /** Callback when video duration changes */
  onDurationChange?: (duration: number) => void;
}

export interface VideoPlayerRef {
  /** Get current playback time */
  getCurrentTime: () => number;
  /** Set current playback time */
  setCurrentTime: (time: number) => void;
  /** Get video duration */
  getDuration: () => number;
  /** Play the video */
  play: () => Promise<void>;
  /** Pause the video */
  pause: () => void;
  /** Get the underlying video element */
  getVideoElement: () => HTMLVideoElement | null;
}

export const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  controls = true,
  className,
  width,
  height,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onLoadedData,
  onDurationChange,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle time updates
  const handleTimeUpdate = (event: Event) => {
    const video = event.target as HTMLVideoElement;
    onTimeUpdate?.(video.currentTime);
  };

  // Handle duration change
  const handleDurationChange = (event: Event) => {
    const video = event.target as HTMLVideoElement;
    onDurationChange?.(video.duration);
  };

  // Attach event listeners to the video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', onPlay || (() => {}));
    video.addEventListener('pause', onPause || (() => {}));
    video.addEventListener('ended', onEnded || (() => {}));
    video.addEventListener('loadeddata', onLoadedData || (() => {}));
    video.addEventListener('durationchange', handleDurationChange);

    // Cleanup
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', onPlay || (() => {}));
      video.removeEventListener('pause', onPause || (() => {}));
      video.removeEventListener('ended', onEnded || (() => {}));
      video.removeEventListener('loadeddata', onLoadedData || (() => {}));
      video.removeEventListener('durationchange', handleDurationChange);
    };
  }, [onTimeUpdate, onPlay, onPause, onEnded, onLoadedData, onDurationChange]);

  return (
    <div className={cn("relative", className)}>
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        controls={controls}
        width={typeof width === 'string' ? undefined : width}
        height={typeof height === 'string' ? undefined : height}
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: '16/9', // Prevent layout shift
        }}
        // Enable loading optimizations
        preload="metadata"
      />
    </div>
  );
};

/**
 * Hook to create a ref for VideoPlayer component
 * Provides imperative API for controlling video playback
 */
export const useVideoPlayerRef = (): [
  React.RefObject<HTMLVideoElement | null>,
  VideoPlayerRef
] => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playerRef: VideoPlayerRef = {
    getCurrentTime: () => videoRef.current?.currentTime || 0,
    setCurrentTime: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    getDuration: () => videoRef.current?.duration || 0,
    play: async () => {
      if (videoRef.current) {
        await videoRef.current.play();
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    getVideoElement: () => videoRef.current,
  };

  return [videoRef, playerRef];
};

export default VideoPlayer;
