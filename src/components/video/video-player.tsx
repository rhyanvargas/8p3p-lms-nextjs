"use client";

import { useRef, useEffect, forwardRef, useCallback } from "react";
import Video from "next-video";
import { cn } from "@/lib/utils";

/**
 * Simplified VideoPlayer component using next-video default player
 * 
 * Uses next-video's built-in Mux integration with support for time tracking
 * and seeking for transcript synchronization.
 * 
 * @example
 * ```tsx
 * <VideoPlayer 
 *   src="/videos/my-video.mp4"
 *   onTimeUpdate={(time) => console.log('Current time:', time)}
 * />
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
  /** Callback when video time updates */
  onTimeUpdate?: (currentTime: number) => void;
  /** Callback when video duration is loaded */
  onDurationChange?: (duration: number) => void;
}

export interface VideoPlayerRef {
  /** Get the underlying video element */
  getVideoElement: () => HTMLVideoElement | null;
  /** Seek to a specific time in the video */
  seekTo: (time: number) => void;
  /** Get current playback time */
  getCurrentTime: () => number;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      autoPlay = false,
      muted = false,
      controls = true,
      className,
      width,
      height,
      onTimeUpdate,
      onDurationChange,
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    
    // Create stable callback refs
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const onDurationChangeRef = useRef(onDurationChange);
    
    // Keep refs up to date
    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate;
      onDurationChangeRef.current = onDurationChange;
    }, [onTimeUpdate, onDurationChange]);
    
    // Callback ref that runs when element mounts/unmounts
    const setVideoRef = useCallback((element: HTMLVideoElement | null) => {
      // Update forwarded ref
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(element);
        } else {
          (forwardedRef as React.MutableRefObject<HTMLVideoElement | null>).current = element;
        }
      }
      
      // Update internal ref
      internalRef.current = element;

      // Set up event listeners when element becomes available
      if (element) {
        const handleTimeUpdate = () => {
          onTimeUpdateRef.current?.(element.currentTime);
        };

        const handleDurationChange = () => {
          onDurationChangeRef.current?.(element.duration);
        };

        element.addEventListener('timeupdate', handleTimeUpdate);
        element.addEventListener('durationchange', handleDurationChange);

        // Store cleanup function
        (element as HTMLVideoElement & { _cleanup?: () => void })._cleanup = () => {
          element.removeEventListener('timeupdate', handleTimeUpdate);
          element.removeEventListener('durationchange', handleDurationChange);
        };
      } else {
        // Cleanup when element is removed
        const oldElement = internalRef.current;
        if (oldElement && (oldElement as HTMLVideoElement & { _cleanup?: () => void })._cleanup) {
          (oldElement as HTMLVideoElement & { _cleanup?: () => void })._cleanup!();
        }
      }
    }, [forwardedRef]);

    return (
      <div className={cn("relative", className)}>
        <Video
          ref={setVideoRef}
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
          preload="metadata"
          playsInline
          // Suppress blur placeholder errors from Mux processing
          blurDataURL=""
        />
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

/**
 * Hook for VideoPlayer ref with seeking and time tracking capabilities
 */
export const useVideoPlayerRef = (): [
  React.RefObject<HTMLVideoElement | null>,
  VideoPlayerRef
] => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playerRef: VideoPlayerRef = {
    getVideoElement: () => videoRef.current,
    seekTo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    getCurrentTime: () => {
      return videoRef.current?.currentTime || 0;
    },
  };

  return [videoRef, playerRef];
};

export default VideoPlayer;
