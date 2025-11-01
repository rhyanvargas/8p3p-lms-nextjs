"use client";

import { useState } from "react";
import { Conversation } from "@/components/cvi/components/conversation";
import { HairCheck } from "@/components/cvi/components/hair-check";
import { LearningCheckReadyScreen } from "./learning-check-ready";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ConversationResponse {
	conversationUrl: string;
	conversationId: string;
	expiresAt?: string;
}

interface LearningCheckBaseProps {
	chapterId: string;
	chapterTitle: string;
}

export const LearningCheckBase = ({
	chapterId,
	chapterTitle,
}: LearningCheckBaseProps) => {
	const [screen, setScreen] = useState<"ready" | "hairCheck" | "call">("ready");
	const [conversation, setConversation] = useState<ConversationResponse | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleEnd = async () => {
		try {
			setScreen("ready");

			if (!conversation?.conversationId) return;

			// Call server-side API to end conversation (API key stays server-side)
			await fetch(
				`/api/learning-checks/conversation/${conversation.conversationId}/end`,
				{
					method: "POST",
				}
			);
		} catch (error) {
			console.error("Failed to end conversation:", error);
		} finally {
			setConversation(null);
		}
	};

	/**
	 * Handle start button click - navigate to hair check
	 */
	const handleStart = () => {
		setError(null);
		setScreen("hairCheck");
	};

	/**
	 * Handle join button click from hair check - create conversation
	 */
	const handleJoin = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch("/api/learning-checks/conversation", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chapterId,
					chapterTitle,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.error || "Failed to create conversation"
				);
			}

			const data = await response.json();
			setConversation(data);
			setScreen("call");
		} catch (error) {
			console.error("Failed to create conversation:", error);
			setError(
				error instanceof Error
					? error.message
					: "Failed to start learning check. Please try again."
			);
			setScreen("ready"); // Return to ready screen on error
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Ready Screen */}
			{screen === "ready" && (
				<LearningCheckReadyScreen
					chapterTitle={chapterTitle}
					isLoading={loading}
					handleOnStart={handleStart}
				/>
			)}

			{/* Hair Check Screen (camera/mic preview) */}
			{screen === "hairCheck" && (
				<HairCheck
					isJoinBtnLoading={loading}
					onJoin={handleJoin}
					onCancel={() => {
						setError(null);
						setScreen("ready");
					}}
				/>
			)}

			{/* Active Conversation */}
			{screen === "call" && conversation && (
				<Conversation
					conversationUrl={conversation.conversationUrl}
					onLeave={handleEnd}
				/>
			)}
		</div>
	);
};

export default LearningCheckBase;
