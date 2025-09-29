/**
 * MediaSync Utility
 * Handles 2-way synchronization between video player and transcript
 */

export interface TranscriptSegment {
	timestamp: string;
	startTime: number; // in seconds
	endTime?: number; // in seconds
	text: string;
}

export class MediaSync {
	private videoElement: HTMLVideoElement | null = null;
	private segments: TranscriptSegment[] = [];
	private currentActiveIndex: number = -1;
	private onActiveSegmentChange?: (index: number, segment: TranscriptSegment) => void;
	private onScrollToSegment?: (index: number) => void;

	constructor(
		segments: TranscriptSegment[],
		onActiveSegmentChange?: (index: number, segment: TranscriptSegment) => void,
		onScrollToSegment?: (index: number) => void
	) {
		this.segments = segments;
		this.onActiveSegmentChange = onActiveSegmentChange;
		this.onScrollToSegment = onScrollToSegment;
	}

	/**
	 * Initialize sync with video element
	 */
	init(videoElement: HTMLVideoElement) {
		this.videoElement = videoElement;
		this.setupVideoListeners();
	}

	/**
	 * Clean up event listeners
	 */
	destroy() {
		if (this.videoElement) {
			this.videoElement.removeEventListener('timeupdate', this.handleTimeUpdate);
			this.videoElement.removeEventListener('seeked', this.handleSeeked);
		}
	}

	/**
	 * Convert timestamp string (e.g., "0:30") to seconds
	 */
	static timestampToSeconds(timestamp: string): number {
		const parts = timestamp.split(':');
		if (parts.length === 2) {
			const minutes = parseInt(parts[0], 10);
			const seconds = parseInt(parts[1], 10);
			return minutes * 60 + seconds;
		}
		return 0;
	}

	/**
	 * Convert seconds to timestamp string
	 */
	static secondsToTimestamp(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	/**
	 * Parse script text into segments with timestamps
	 */
	static parseScriptToSegments(script: string): TranscriptSegment[] {
		// For now, we'll create segments based on sentences
		// In a real implementation, you'd have actual timestamp data
		const sentences = script.split('.').filter(s => s.trim().length > 0);
		const segments: TranscriptSegment[] = [];
		
		sentences.forEach((sentence, index) => {
			// Generate mock timestamps (every 10 seconds)
			const startTime = index * 10;
			const timestamp = MediaSync.secondsToTimestamp(startTime);
			
			segments.push({
				timestamp,
				startTime,
				endTime: startTime + 10,
				text: sentence.trim() + '.'
			});
		});

		return segments;
	}

	/**
	 * Handle video time updates
	 */
	private handleTimeUpdate = () => {
		if (!this.videoElement) return;

		const currentTime = this.videoElement.currentTime;
		const activeIndex = this.findActiveSegmentIndex(currentTime);

		if (activeIndex !== this.currentActiveIndex && activeIndex !== -1) {
			this.currentActiveIndex = activeIndex;
			const activeSegment = this.segments[activeIndex];
			
			// Notify about active segment change
			if (this.onActiveSegmentChange) {
				this.onActiveSegmentChange(activeIndex, activeSegment);
			}

			// Scroll transcript to active segment
			if (this.onScrollToSegment) {
				this.onScrollToSegment(activeIndex);
			}
		}
	};

	/**
	 * Handle video seeking
	 */
	private handleSeeked = () => {
		this.handleTimeUpdate(); // Update active segment immediately after seeking
	};

	/**
	 * Find the active segment index based on current time
	 */
	private findActiveSegmentIndex(currentTime: number): number {
		return this.segments.findIndex(segment => {
			const endTime = segment.endTime || segment.startTime + 10;
			return currentTime >= segment.startTime && currentTime < endTime;
		});
	}

	/**
	 * Seek video to specific timestamp
	 */
	seekToTimestamp(timestamp: string) {
		if (!this.videoElement) return;

		const seconds = MediaSync.timestampToSeconds(timestamp);
		this.videoElement.currentTime = seconds;
	}

	/**
	 * Setup video event listeners
	 */
	private setupVideoListeners() {
		if (!this.videoElement) return;

		this.videoElement.addEventListener('timeupdate', this.handleTimeUpdate);
		this.videoElement.addEventListener('seeked', this.handleSeeked);
	}

	/**
	 * Get current active segment index
	 */
	getCurrentActiveIndex(): number {
		return this.currentActiveIndex;
	}

	/**
	 * Get all segments
	 */
	getSegments(): TranscriptSegment[] {
		return this.segments;
	}
}
