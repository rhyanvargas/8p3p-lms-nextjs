"use client";

import { useRef } from "react";
import Video from "next-video";
import { cn } from "@/lib/utils";

/**
 * Simplified VideoPlayer component using next-video default player
 * 
 * Uses next-video's built-in Mux integration with minimal customization.
 * For transcript synchronization, use InteractiveVideoPlayer instead.
 * 
 * @example
 * ```tsx
 * <VideoPlayer src="/videos/my-video.mp4" />
 * ```
 */

export interface VideoPlayerProps {
  /** Video source - can be local file path, remote URL, or next-video Asset */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}

export interface VideoPlayerRef {
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
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        // Prevent loading until user interaction (prevents error flash)
        preload="none"
        playsInline
      />
    </div>
  );
};

/**
 * Simplified hook for VideoPlayer ref
 * For advanced video control, use next-video's built-in capabilities
 */
export const useVideoPlayerRef = (): [
  React.RefObject<HTMLVideoElement | null>,
  VideoPlayerRef
] => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playerRef: VideoPlayerRef = {
    getVideoElement: () => videoRef.current,
  };

  return [videoRef, playerRef];
};

export default VideoPlayer;
