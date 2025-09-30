/**
 * Video Components
 * 
 * Simplified video components using next-video default player
 * with transcript synchronization support.
 */

export { VideoPlayer, useVideoPlayerRef } from './video-player';
export type { VideoPlayerProps, VideoPlayerRef } from './video-player';

export { InteractiveVideoPlayer, createTranscriptFromScript } from './interactive-video-player';
export type { InteractiveVideoPlayerProps, TranscriptSegment } from './interactive-video-player';

export { TranscriptPanel } from './transcript-panel';

// Re-export next-video for convenience
export { default as Video } from 'next-video';
export type { PlayerProps } from 'next-video';
