"use client";

import { useCallback } from "react";
import { useDaily } from "@daily-co/daily-react";

export const useCVICall = (): {
	joinCall: (props: { url: string }) => void;
	leaveCall: () => void;
} => {
	const daily = useDaily();

	// use-cvi-call.tsx
	const joinCall = useCallback(
		async ({ url }: { url: string }) => {
			if (!daily) return;

			try {
				const currentState = daily.meetingState();
				console.log("📡 Current Daily state:", currentState);

				// If in preview mode from HairCheck, leave first
				if (currentState === "joined-meeting") {
					console.log("🔄 Leaving preview mode before joining conversation...");
					await daily.leave();

					// Wait for Daily to fully exit
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				// Now join the actual conversation
				console.log("📞 Joining conversation:", url);
				await daily.join({
					url,
					inputSettings: {
						audio: {
							processor: {
								type: "noise-cancellation",
							},
						},
					},
				});

				console.log("✅ Successfully joined conversation");
			} catch (error) {
				console.error("❌ Failed to join conversation:", error);
				throw error;
			}
		},
		[daily]
	);
	const leaveCall = useCallback(() => {
		daily?.leave();
	}, [daily]);

	return { joinCall, leaveCall };
};
