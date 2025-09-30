"use client";

import { useRef, useEffect } from "react";
import type { PlayerProps } from "next-video";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";

/**
 * Custom Mux Player component for next-video
 * 
 * This component provides advanced Mux Player features while maintaining
 * compatibility with the next-video abstraction layer.
 * 
 * Features:
 * - Direct Mux Player integration
 * - Advanced analytics and metadata
 * - Custom styling and theming
 * - Full event handling
 * 
 * @example
 * ```tsx
 * import Video from 'next-video';
 * import CustomMuxPlayer from './custom-mux-player';
 * 
 * <Video 
 *   as={CustomMuxPlayer}
 *   src={videoSrc}
 *   onTimeUpdate={handleTimeUpdate}
 * />
 * ```
 */

interface CustomMuxPlayerProps extends Omit<PlayerProps, 'theme'> {
  /** Custom CSS classes */
  className?: string;
  /** Video metadata for analytics */
  metadata?: {
    video_id?: string;
    video_title?: string;
    viewer_user_id?: string;
    [key: string]: any;
  };
  /** Custom theme configuration */
  theme?: string;
  /** Callback when video time updates */
  onTimeUpdate?: (currentTime: number) => void;
  /** Callback when video starts playing */
  onPlay?: () => void;
  /** Callback when video pauses */
  onPause?: () => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback when video is ready */
  onLoadedData?: () => void;
  /** Callback when duration changes */
  onDurationChange?: (duration: number) => void;
}

export default function CustomMuxPlayer({
  asset,
  src,
  poster,
  blurDataURL,
  className,
  metadata,
  theme,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onLoadedData,
  onDurationChange,
  ...rest
}: CustomMuxPlayerProps) {
  const playerRef = useRef<any>(null);

  // Extract Mux playback ID from asset metadata
  const playbackId = asset?.providerMetadata?.mux?.playbackId;

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

  // Set up event listeners
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    // Add event listeners
    player.addEventListener('timeupdate', handleTimeUpdate);
    player.addEventListener('play', onPlay || (() => {}));
    player.addEventListener('pause', onPause || (() => {}));
    player.addEventListener('ended', onEnded || (() => {}));
    player.addEventListener('loadeddata', onLoadedData || (() => {}));
    player.addEventListener('durationchange', handleDurationChange);

    // Cleanup
    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
      player.removeEventListener('play', onPlay || (() => {}));
      player.removeEventListener('pause', onPause || (() => {}));
      player.removeEventListener('ended', onEnded || (() => {}));
      player.removeEventListener('loadeddata', onLoadedData || (() => {}));
      player.removeEventListener('durationchange', handleDurationChange);
    };
  }, [onTimeUpdate, onPlay, onPause, onEnded, onLoadedData, onDurationChange]);

  // Convert poster to string if it's a StaticImageData
  const posterUrl = typeof poster === 'string' ? poster : (poster as any)?.src;
  const blurUrl = typeof blurDataURL === 'string' ? blurDataURL : (blurDataURL as any)?.src;

  // If we have a Mux playback ID, use it directly
  if (playbackId) {
    return (
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        poster={posterUrl}
        metadata={metadata}
        className={cn("w-full h-full", className)}
        {...rest}
      />
    );
  }

  // Fallback to regular video element for non-Mux sources
  return (
    <video
      ref={playerRef}
      src={src}
      poster={posterUrl || blurUrl}
      className={cn("w-full h-full", className)}
      controls
      {...rest}
    />
  );
}

/**
 * Utility function to create metadata for Mux analytics
 */
export function createMuxMetadata({
  videoId,
  videoTitle,
  userId,
  courseId,
  sectionId,
}: {
  videoId?: string;
  videoTitle?: string;
  userId?: string;
  courseId?: string;
  sectionId?: string;
}) {
  return {
    video_id: videoId,
    video_title: videoTitle,
    viewer_user_id: userId,
    // Custom metadata for LMS tracking
    course_id: courseId,
    section_id: sectionId,
    player_name: '8P3P LMS Player',
    player_version: '1.0.0',
  };
}
