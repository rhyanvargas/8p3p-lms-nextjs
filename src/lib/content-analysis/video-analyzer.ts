/**
 * Video Analysis Engine for Content Estimation System
 *
 * Analyzes video content metadata to provide accurate duration information
 * and video type classification for mixed content time estimation.
 *
 * Handles various video formats and provides fallback duration parsing
 * for reliable time estimation in educational content.
 */

export interface VideoMetadata {
	/** Video URL or identifier */
	url: string;
	/** Video duration in seconds (if available) */
	duration?: number;
	/** Video title or description */
	title?: string;
	/** Video type classification */
	type?: "lecture" | "demo" | "interactive" | "unknown";
	/** Video format/source */
	format?: "mp4" | "webm" | "youtube" | "vimeo" | "other";
}

export interface VideoAnalysis {
	/** Video duration in seconds */
	duration: number;
	/** Video type affecting engagement and pacing */
	type: "lecture" | "demo" | "interactive" | "unknown";
	/** Video format for compatibility checking */
	format: "mp4" | "webm" | "youtube" | "vimeo" | "other";
	/** Whether duration was parsed or estimated */
	isDurationEstimated: boolean;
	/** Additional time factors for different video types */
	engagementFactors: {
		pauseFrequency: number; // Expected pause frequency (0-1)
		replayLikelihood: number; // Likelihood of replaying sections (0-1)
		interactionTime: number; // Additional time for interactions (seconds)
	};
}

/**
 * Analyzes video metadata to extract duration and classify video type
 *
 * @param metadata - Video metadata including URL and optional duration
 * @returns Comprehensive video analysis with duration and engagement factors
 *
 * @example
 * const analysis = analyzeVideoContent({
 *   url: "https://example.com/video.mp4",
 *   duration: 300,
 *   title: "EMDR Therapy Introduction"
 * });
 * // Returns: { duration: 300, type: 'lecture', format: 'mp4', ... }
 */
export function analyzeVideoContent(metadata: VideoMetadata): VideoAnalysis {
	// Extract duration from metadata or estimate from URL
	const duration = metadata.duration || estimateDurationFromUrl(metadata.url);

	// Determine video format from URL
	const format = determineVideoFormat(metadata.url);

	// Classify video type based on title and URL patterns
	const type = classifyVideoType(metadata.title || "", metadata.url);

	// Calculate engagement factors based on video type
	const engagementFactors = calculateEngagementFactors(type, duration);

	return {
		duration,
		type,
		format,
		isDurationEstimated: !metadata.duration,
		engagementFactors,
	};
}

/**
 * Attempts to estimate video duration from URL patterns
 *
 * For educational content, provides reasonable estimates when
 * exact duration is not available in metadata.
 *
 * @param url - Video URL to analyze
 * @returns Estimated duration in seconds, or default if cannot determine
 */
function estimateDurationFromUrl(url: string): number {
	// YouTube URL duration extraction (if available in URL parameters)
	const youtubeMatch = url.match(/[?&]t=(\d+)/);
	if (youtubeMatch) {
		return parseInt(youtubeMatch[1], 10);
	}

	// Vimeo URL patterns (limited extraction possible)
	if (url.includes("vimeo.com")) {
		// Default estimate for Vimeo educational content
		return 600; // 10 minutes default
	}

	// File-based video duration hints from filename
	const durationMatch = url.match(/(\d+)min|(\d+)m(\d+)s/);
	if (durationMatch) {
		const minutes = parseInt(durationMatch[1] || "0", 10);
		const seconds = parseInt(durationMatch[3] || "0", 10);
		return minutes * 60 + seconds;
	}

	// Default estimate for unknown videos (educational content average)
	return 480; // 8 minutes default for educational videos
}

/**
 * Determines video format from URL analysis
 *
 * @param url - Video URL to analyze
 * @returns Video format classification
 */
function determineVideoFormat(
	url: string
): "mp4" | "webm" | "youtube" | "vimeo" | "other" {
	const urlLower = url.toLowerCase();

	if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
		return "youtube";
	}

	if (urlLower.includes("vimeo.com")) {
		return "vimeo";
	}

	if (urlLower.endsWith(".mp4")) {
		return "mp4";
	}

	if (urlLower.endsWith(".webm")) {
		return "webm";
	}

	return "other";
}

/**
 * Classifies video type based on title and URL patterns
 *
 * Uses keyword analysis to determine the type of educational content
 * which affects how users typically engage with the video.
 *
 * @param title - Video title or description
 * @param url - Video URL for additional context
 * @returns Video type classification
 */
function classifyVideoType(
	title: string,
	url: string
): "lecture" | "demo" | "interactive" | "unknown" {
	const titleLower = title.toLowerCase();
	const urlLower = url.toLowerCase();

	// Demo/demonstration keywords
	const demoKeywords = [
		"demo",
		"demonstration",
		"tutorial",
		"walkthrough",
		"step-by-step",
		"how-to",
		"practice",
		"example",
		"case study",
		"session",
	];

	// Interactive content keywords
	const interactiveKeywords = [
		"interactive",
		"exercise",
		"activity",
		"practice",
		"simulation",
		"role-play",
		"guided",
		"participation",
		"engagement",
	];

	// Lecture/presentation keywords
	const lectureKeywords = [
		"lecture",
		"presentation",
		"introduction",
		"overview",
		"theory",
		"concept",
		"explanation",
		"background",
		"foundation",
		"principles",
	];

	// Check for demo content
	if (
		demoKeywords.some(
			(keyword) => titleLower.includes(keyword) || urlLower.includes(keyword)
		)
	) {
		return "demo";
	}

	// Check for interactive content
	if (
		interactiveKeywords.some(
			(keyword) => titleLower.includes(keyword) || urlLower.includes(keyword)
		)
	) {
		return "interactive";
	}

	// Check for lecture content
	if (
		lectureKeywords.some(
			(keyword) => titleLower.includes(keyword) || urlLower.includes(keyword)
		)
	) {
		return "lecture";
	}

	// Default to lecture for educational content
	return "lecture";
}

/**
 * Calculates engagement factors based on video type and duration
 *
 * Different types of educational videos have different engagement patterns
 * that affect total learning time beyond just video duration.
 *
 * @param type - Video type classification
 * @param duration - Video duration in seconds
 * @returns Engagement factors affecting total learning time
 */
function calculateEngagementFactors(
	type: "lecture" | "demo" | "interactive" | "unknown",
	duration: number
): VideoAnalysis["engagementFactors"] {
	switch (type) {
		case "lecture":
			return {
				pauseFrequency: 0.3, // 30% chance of pausing for notes
				replayLikelihood: 0.2, // 20% chance of replaying sections
				interactionTime: Math.min(duration * 0.1, 60), // 10% of duration, max 1 minute
			};

		case "demo":
			return {
				pauseFrequency: 0.6, // 60% chance of pausing to follow along
				replayLikelihood: 0.4, // 40% chance of replaying to practice
				interactionTime: Math.min(duration * 0.2, 120), // 20% of duration, max 2 minutes
			};

		case "interactive":
			return {
				pauseFrequency: 0.8, // 80% chance of pausing for participation
				replayLikelihood: 0.3, // 30% chance of replaying for clarity
				interactionTime: Math.min(duration * 0.3, 180), // 30% of duration, max 3 minutes
			};

		case "unknown":
		default:
			return {
				pauseFrequency: 0.4, // Conservative estimate
				replayLikelihood: 0.25, // Conservative estimate
				interactionTime: Math.min(duration * 0.15, 90), // 15% of duration, max 1.5 minutes
			};
	}
}

/**
 * Calculates total learning time including engagement factors
 *
 * @param analysis - Video analysis results
 * @returns Total estimated learning time in seconds
 *
 * @example
 * const totalTime = calculateTotalVideoTime(videoAnalysis);
 * // Returns video duration + estimated pause/replay/interaction time
 */
export function calculateTotalVideoTime(analysis: VideoAnalysis): number {
	const { duration, engagementFactors } = analysis;

	// Base video duration
	let totalTime = duration;

	// Add time for expected pauses (pause frequency * average pause duration)
	const averagePauseDuration = 15; // 15 seconds average pause
	const pauseTime =
		duration *
		engagementFactors.pauseFrequency *
		(averagePauseDuration / duration);
	totalTime += pauseTime;

	// Add time for likely replays
	const replayTime = duration * engagementFactors.replayLikelihood;
	totalTime += replayTime;

	// Add interaction time
	totalTime += engagementFactors.interactionTime;

	return Math.round(totalTime);
}

/**
 * Validates video metadata for analysis
 *
 * @param metadata - Video metadata to validate
 * @returns True if metadata is valid for analysis
 */
export function isValidVideoMetadata(metadata: VideoMetadata): boolean {
	if (!metadata || typeof metadata !== "object") return false;
	if (!metadata.url || typeof metadata.url !== "string") return false;
	if (metadata.url.trim().length === 0) return false;

	// Optional: Validate URL format
	try {
		new URL(metadata.url);
		return true;
	} catch {
		// If URL is invalid, check if it's a relative path or identifier
		return metadata.url.length > 0;
	}
}
