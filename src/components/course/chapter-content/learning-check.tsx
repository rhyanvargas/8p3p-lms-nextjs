"use client";

/**
 * Learning Check - Chapter-End Conversational Assessment
 *
 * Phase 1 MVP: Core functionality with console logging
 * - Quiz-gated access
 * - 3-minute timer with hard stop
 * - Engagement tracking (≥90s threshold)
 * - Conversation termination on all triggers
 * - Console log completion data
 *
 * @see specs/features/learning-check/learning-check-spec.md
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/common/timer";
import { Conversation } from "@/components/cvi/components/conversation";
import { HairCheck } from "@/components/cvi/components/hair-check";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Lock, CheckCircle, AlertTriangle } from "lucide-react";

interface LearningCheckProps {
	chapterId: string;
	chapterTitle: string;
	quizPassed: boolean;
	quizScore?: number;
	quizUrl?: string; // URL to navigate to the quiz section
	onComplete?: () => void;
}

type LearningCheckState =
	| "locked" // Quiz not passed
	| "ready" // Ready to start
	| "hair_check" // Camera/mic preview (not billed yet)
	| "active" // Conversation in progress (billing active)
	| "ended_incomplete" // Session ended, threshold not met
	| "ended_complete" // Session ended, threshold met
	| "completed"; // Marked as complete

interface LearningCheckData {
	chapterId: string;
	userId: string;
	conversationId: string;
	startedAt: Date;
	endedAt: Date | null;
	duration: number;
	engagementTime: number;
	engagementPercent: number;
	completed: boolean;
	transcript: string;
}

export function LearningCheck({
	chapterId,
	chapterTitle,
	quizPassed,
	quizScore,
	quizUrl,
	onComplete,
}: LearningCheckProps) {
	const router = useRouter();
	const [state, setState] = useState<LearningCheckState>(
		quizPassed ? "ready" : "locked"
	);
	const [conversationUrl, setConversationUrl] = useState<string | null>(null);
	const [conversationId, setConversationId] = useState<string | null>(null);
	const [engagementTime, setEngagementTime] = useState(0);
	const [finalEngagementTime, setFinalEngagementTime] = useState(0); // Store final value for ended states
	const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Track if user is currently speaking (mock for Phase 1, will use Daily.co audio levels in Phase 2)
	const engagementIntervalRef = useRef<NodeJS.Timeout | null>(null);

	// Constants
	const SESSION_DURATION = 180; // 3 minutes
	const ENGAGEMENT_THRESHOLD = 90; // 50% of 180 seconds
	const engagementPercent = (engagementTime / SESSION_DURATION) * 100;
	const thresholdMet = engagementTime >= ENGAGEMENT_THRESHOLD;
	const TEST_MODE = false;

	/**
	 * Create Tavus conversation
	 */
	const createConversation = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Get structured objectives and guardrails IDs from environment
			const objectivesId = process.env.NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID;
			const guardrailsId = process.env.NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID;

			console.log("🎯 Creating conversation with structured assets:", {
				objectivesId: objectivesId || "fallback to context-only",
				guardrailsId: guardrailsId || "fallback to context-only"
			});

			const requestBody: {
				chapterId: string;
				chapterTitle: string;
				objectivesId?: string;
				guardrailsId?: string;
			} = {
				chapterId,
				chapterTitle,
			};

			// Add structured assets if available
			if (objectivesId) {
				requestBody.objectivesId = objectivesId;
			}
			if (guardrailsId) {
				requestBody.guardrailsId = guardrailsId;
			}

			const response = await fetch("/api/learning-checks/conversation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				throw new Error("Failed to create conversation");
			}

			const data = await response.json();
			setConversationUrl(data.conversationUrl);
			setConversationId(data.conversationId);
			setSessionStartTime(new Date());
			setState("active");

			// Track analytics
			console.log("📊 Analytics: lc_started", {
				chapterId,
				userId: "user-123", // TODO: Get from auth context
				hasObjectives: !!objectivesId,
				hasGuardrails: !!guardrailsId,
				timestamp: new Date().toISOString(),
			});

			// Start engagement tracking (mock for Phase 1)
			startEngagementTracking();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to start session");
			console.error("Failed to create conversation:", err);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Handle timer tick - track elapsed time for engagement
	 */
	const handleTimerTick = useCallback((remainingTime: number) => {
		const elapsedTime = SESSION_DURATION - remainingTime;
		setEngagementTime(elapsedTime);
		console.log("⏱️ Engagement time:", elapsedTime, "seconds");
	}, [SESSION_DURATION]);

	/**
	 * Mock engagement tracking (Phase 1)
	 * In Phase 2, this will use Daily.co audio level detection
	 */
	const startEngagementTracking = () => {
		console.log("🟢 Starting engagement tracking via timer...");
		// Engagement now tracked via timer onTick callback
	};

	const stopEngagementTracking = () => {
		if (engagementIntervalRef.current) {
			console.log("🔴 Stopping engagement tracking");
			clearInterval(engagementIntervalRef.current);
			engagementIntervalRef.current = null;
		}
	};

	/**
	 * Terminate Tavus conversation
	 */
	const terminateConversation = useCallback(
		async (reason: string) => {
			if (!conversationId) return;

			stopEngagementTracking();

			try {
				await fetch("/api/learning-checks/terminate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ conversationId }),
				});

				console.log("📊 Analytics: lc_terminated", {
					chapterId,
					conversationId,
					reason,
					engagementTime,
					timestamp: new Date().toISOString(),
				});
			} catch (err) {
				console.error("Failed to terminate conversation:", err);
			}
		},
		[conversationId, chapterId, engagementTime]
	);

	/**
	 * Handle timer expiration (hard stop at 4 minutes)
	 */
	const handleTimerExpire = useCallback(async () => {
		console.log("⏰ Timer expired");

		// Stop tracking first
		stopEngagementTracking();

		await terminateConversation("timeout");

		// Capture final engagement time
		setEngagementTime((currentEngagementTime) => {
			console.log(
				"📊 Final engagement time at timeout:",
				currentEngagementTime
			);

			setFinalEngagementTime(currentEngagementTime);

			const currentThresholdMet = currentEngagementTime >= ENGAGEMENT_THRESHOLD;

			const endState: LearningCheckState = currentThresholdMet
				? "ended_complete"
				: "ended_incomplete";

			setState(endState);

			console.log("📊 Analytics: lc_timeout", {
				chapterId,
				userId: "user-123",
				engagementTime: currentEngagementTime,
				thresholdMet: currentThresholdMet,
			});

			return currentEngagementTime;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [terminateConversation, chapterId, conversationId]);

	/**
	 * Handle manual end session
	 */
	const handleEndSession = async () => {
		console.log("🔴 handleEndSession called");

		// Stop tracking FIRST to prevent further updates
		stopEngagementTracking();

		// Capture the current engagement time using functional update
		setEngagementTime((currentEngagementTime) => {
			console.log("📊 Final engagement time captured:", currentEngagementTime);

			// Store the final value
			setFinalEngagementTime(currentEngagementTime);

			const currentThresholdMet = currentEngagementTime >= ENGAGEMENT_THRESHOLD;

			// Terminate conversation
			terminateConversation("manual");

			// Determine end state
			const endState: LearningCheckState = currentThresholdMet
				? "ended_complete"
				: "ended_incomplete";

			console.log(
				"📊 Setting state to:",
				endState,
				"with engagement:",
				currentEngagementTime
			);
			setState(endState);

			// Log analytics
			console.log("📊 Analytics: lc_user_end", {
				chapterId,
				userId: "user-123",
				engagementTime: currentEngagementTime,
				thresholdMet: currentThresholdMet,
				timestamp: new Date().toISOString(),
			});

			return currentEngagementTime;
		});
	};

	/**
	 * Handle mark complete
	 */
	const handleMarkComplete = () => {
		setState("completed");

		console.log("📊 Analytics: lc_completed", {
			chapterId,
			userId: "user-123",
			engagementTime,
			engagementPercent: Math.round(engagementPercent),
		});

		// Log final completion data
		logCompletionData("completed");

		if (onComplete) {
			onComplete();
		}
	};

	/**
	 * Handle retry - reset all state and start over
	 */
	const handleRetry = () => {
		console.log("🔄 Retrying learning check...");

		// Reset all conversation state
		setConversationUrl(null);
		setConversationId(null);
		setEngagementTime(0);
		setFinalEngagementTime(0); // Reset final time too
		setSessionStartTime(null);
		setError(null);

		// Return to ready state
		setState("ready");

		console.log("📊 Analytics: lc_retry", {
			chapterId,
			userId: "user-123",
			previousEngagement: engagementTime,
		});
	};

	/**
	 * Log completion data to console (Phase 1)
	 * Phase 3+ will store to localStorage/database
	 */
	const logCompletionData = (endReason: string) => {
		const data: LearningCheckData = {
			chapterId,
			userId: "user-123", // TODO: Get from auth context
			conversationId: conversationId || "",
			startedAt: sessionStartTime || new Date(),
			endedAt: new Date(),
			duration: sessionStartTime
				? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
				: 0,
			engagementTime,
			engagementPercent: Math.round(engagementPercent),
			completed: state === "completed",
			transcript: "", // Phase 2: Will be populated from webhook
		};

		console.log("💾 Learning Check Data:", {
			...data,
			endReason,
			thresholdMet,
			timestamp: new Date().toISOString(),
		});
	};

	/**
	 * Cleanup: Terminate conversation on unmount
	 */
	useEffect(() => {
		return () => {
			if (state === "active" && conversationId) {
				terminateConversation("component_unmount");
			}
			stopEngagementTracking();
		};
	}, [state, conversationId, terminateConversation]);

	/**
	 * Handle browser navigation (tab close, refresh, external links)
	 * Note: beforeunload only fires for browser-level navigation, not Next.js route changes
	 */
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (state === "active") {
				e.preventDefault();
				e.returnValue = ""; // Still required despite deprecation for cross-browser compatibility

				// Use sendBeacon for reliability
				if (conversationId) {
					navigator.sendBeacon(
						"/api/learning-checks/terminate",
						JSON.stringify({ conversationId })
					);
				}
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [state, conversationId]);

	/**
	 * Handle SPA navigation (Next.js route changes)
	 * Modern approach: Use popstate for back/forward, component unmount handles normal navigation
	 */
	useEffect(() => {
		if (state !== "active") return;

		const handlePopState = (e: PopStateEvent) => {
			const confirmed = window.confirm(
				"You have an active Learning Check conversation. Are you sure you want to leave? Your progress may be lost."
			);

			if (!confirmed) {
				// Prevent navigation by restoring history
				window.history.pushState(null, "", window.location.href);
				e.preventDefault();
			} else {
				// Allow navigation, terminate conversation
				if (conversationId) {
					navigator.sendBeacon(
						"/api/learning-checks/terminate",
						JSON.stringify({ conversationId })
					);
				}
			}
		};

		// Push initial state to enable popstate detection
		window.history.pushState(null, "", window.location.href);
		window.addEventListener("popstate", handlePopState);

		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [state, conversationId]);

	// Render locked state
	if (state === "locked") {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Lock />
					</EmptyMedia>
					<EmptyTitle>Learning Check Locked</EmptyTitle>
					<EmptyDescription>
						You must pass the chapter quiz (≥70%) to unlock this conversational
						assessment.
						{quizScore !== undefined && (
							<span className="block mt-2 font-medium">
								Your current score: {quizScore}%
							</span>
						)}
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					{quizUrl ? (
						<Button onClick={() => router.push(quizUrl)} size="sm">
							Go to Quiz
						</Button>
					) : (
						<Button variant="outline" size="sm" disabled>
							Quiz Not Available
						</Button>
					)}
				</EmptyContent>
			</Empty>
		);
	}

	// Render ready state
	if (state === "ready") {
		return (
			<Card className="shadow-none">
				<CardHeader className="p-2">
					<CardTitle>{chapterTitle}</CardTitle>
					<CardDescription className="text-muted-foreground">
						Have a 3-minute conversation with your AI instructor to demonstrate
						your understanding of this chapter.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="space-y-2">
						<h4 className="font-semibold">What to expect:</h4>
						<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
							<li>3-minute conversation with AI avatar</li>
							<li>Questions about recall, application, and self-explanation</li>
							<li>Must engage for at least 90 seconds (50%) to complete</li>
							<li>Camera and microphone required</li>
						</ul>
					</div>

					<Button
						onClick={() => setState("hair_check")}
						disabled={isLoading}
						className="w-full"
					>
						Start Learning Check
					</Button>

					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>
		);
	}

	// Render hair check OR conversation (never both at once - Tavus pattern)
	// HairCheck must unmount before Conversation mounts to avoid Daily.co state conflicts
	if (state === "hair_check" || state === "active") {
		return (
			<div className="space-y-4">
				{state === "hair_check" && (
					<HairCheck
						isJoinBtnLoading={isLoading}
						onJoin={async () => {
							// Create conversation when user clicks "Join Video"
							// This follows Tavus recommended flow
							await createConversation();
						}}
						onCancel={() => setState("ready")}
					/>
				)}
				
				{state === "active" && conversationUrl && (
					<>
						{/* Header with timer and engagement */}
						<div className="flex justify-between items-center">
							<div className="text-sm">
								<span>Learning Check In Progress...</span>
								<p className="text-xs text-muted-foreground">
									Speak and engage for at least 90 seconds to complete this learning
									check
								</p>
							</div>
							<Timer
								duration={SESSION_DURATION}
								onExpire={handleTimerExpire}
								onTick={handleTimerTick}
								autoStart={true}
								warningThreshold={30}
								variant="compact"
							/>
						</div>
						{TEST_MODE ? (
							<div className="h-[600px] bg-gray-200">TEST MODE ON</div>
						) : (
							<Conversation
								conversationUrl={conversationUrl}
								onLeave={handleEndSession}
							/>
						)}
					</>
				)}
				
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
			</div>
		);
	}

	// Render ended states
	if (state === "ended_incomplete" || state === "ended_complete") {
		// Use finalEngagementTime for display (captured when session ended)
		const displayEngagementTime =
			finalEngagementTime > 0 ? finalEngagementTime : engagementTime;
		const displayEngagementPercent =
			(displayEngagementTime / SESSION_DURATION) * 100;
		const displayThresholdMet = displayEngagementTime >= ENGAGEMENT_THRESHOLD;

		return (
			<Card className="shadow-none">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{displayThresholdMet ? (
							<>
								<CheckCircle className="h-5 w-5 text-green-600" />
								Session Complete
							</>
						) : (
							<>
								<AlertTriangle className="h-5 w-5 text-orange-600" />
								Engagement Threshold Not Met
							</>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Engagement Time:</span>
							<span className="font-semibold">
								{displayEngagementTime}s / {ENGAGEMENT_THRESHOLD}s
							</span>
						</div>
						<Progress value={displayEngagementPercent} className="h-2" />
					</div>

					{displayThresholdMet ? (
						<>
							<Alert>
								<CheckCircle className="h-4 w-4" />
								<AlertDescription>
									Great job! You engaged for {displayEngagementTime} seconds.
									Click below to mark this learning check as complete.
								</AlertDescription>
							</Alert>
							<Button onClick={handleMarkComplete} className="w-full">
								Mark Learning Check Complete
							</Button>
						</>
					) : (
						<>
							<Alert variant="destructive">
								<AlertTriangle className="h-4 w-4" />
								<AlertDescription>
									You need to engage for at least {ENGAGEMENT_THRESHOLD}{" "}
									seconds. You engaged for {displayEngagementTime} seconds.
									Please try again.
								</AlertDescription>
							</Alert>
							<Button onClick={handleRetry} className="w-full">
								Try Again
							</Button>
						</>
					)}
				</CardContent>
			</Card>
		);
	}

	// Render completed state
	if (state === "completed") {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle className="h-5 w-5 text-green-600" />
						Learning Check Completed
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert>
						<CheckCircle className="h-4 w-4" />
						<AlertDescription>
							Excellent work! You&apos;ve completed the learning check for{" "}
							{chapterTitle}. Your conversation data has been recorded.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return null;
}
