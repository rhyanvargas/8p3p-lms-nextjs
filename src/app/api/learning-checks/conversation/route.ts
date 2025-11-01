import { NextRequest, NextResponse } from "next/server";
import {
	buildChapterContext,
	buildGreeting,
	TAVUS_DEFAULTS,
	TAVUS_ENV,
} from "@/lib/tavus";

/**
 * Create Tavus Conversation for Learning Check
 *
 * Phase 1: Structured conversation with objectives, guardrails, and chapter context
 * Phase 2: Add webhook URL for perception analysis
 *
 * Architecture:
 * - Objectives: Enforce assessment structure (recall → application → self-explanation)
 * - Guardrails: Enforce behavioral boundaries (quiz protection, time management, scope)
 * - Context: Chapter-specific information and learning objectives
 *
 * @see specs/features/learning-check/learning-check-implementation.md
 * @see src/lib/tavus/config.ts for configuration
 */

interface CreateConversationRequest {
	chapterId: string;
	chapterTitle: string;
	objectivesId?: string; // Optional: override default objectives
	guardrailsId?: string; // Optional: override default guardrails
}

export async function POST(request: NextRequest) {
	try {
		const body: CreateConversationRequest = await request.json();
		const { chapterId, chapterTitle, objectivesId, guardrailsId } = body;

		// Validate required fields
		if (!chapterId || !chapterTitle) {
			return NextResponse.json(
				{ error: "Missing required fields: chapterId, chapterTitle" },
				{ status: 400 }
			);
		}

		// Get environment variables using type-safe helpers
		const apiKey = TAVUS_ENV.getApiKey();
		const personaId = TAVUS_ENV.getPersonaId();

		if (!apiKey || !personaId) {
			console.error("Missing Tavus configuration:", {
				hasApiKey: !!apiKey,
				hasPersonaId: !!personaId,
			});
			return NextResponse.json(
				{
					error:
						"Tavus configuration missing. Please set TAVUS_API_KEY and TAVUS_PERSONA_ID.",
				},
				{ status: 500 }
			);
		}

		// Build chapter-specific context and greeting for AI instructor
		const conversationalContext = buildChapterContext(chapterId, chapterTitle);
		const customGreeting = buildGreeting(chapterTitle);

		// Get learning check duration from environment (default: 180 seconds = 3 minutes)
		const learningCheckDuration = TAVUS_ENV.getLearningCheckDuration();

		// Create Tavus conversation with structured objectives and guardrails
		const conversationBody: Record<string, unknown> = {
			persona_id: personaId,
			replica_id: TAVUS_DEFAULTS.DEFAULT_REPLICA_ID, // Required if persona doesn't have default replica
			conversational_context: conversationalContext,
			custom_greeting: customGreeting,
			conversation_name: `Learning Check: ${chapterTitle}`,
			test_mode: TAVUS_DEFAULTS.TEST_MODE,
			// Enforce time limit (max 3600 seconds per Tavus API)
			properties: {
				max_call_duration: learningCheckDuration,
				participant_left_timeout: 10, // End 10 seconds after participant leaves
				participant_absent_timeout: 60, // End if no one joins within 60 seconds
			},
		};

		// Add objectives ID (for structured assessment)
		// Use provided ID or fall back to environment variable
		const finalObjectivesId = objectivesId || TAVUS_ENV.getObjectivesId();
		if (finalObjectivesId) {
			conversationBody.objectives_id = finalObjectivesId;
		}

		// Add guardrails ID (for compliance enforcement)
		// Use provided ID or fall back to environment variable
		const finalGuardrailsId = guardrailsId || TAVUS_ENV.getGuardrailsId();
		if (finalGuardrailsId) {
			conversationBody.guardrails_id = finalGuardrailsId;
		}

		// Phase 2: Add callback_url for perception analysis webhook
		const webhookUrl = TAVUS_ENV.getWebhookUrl();
		if (webhookUrl) {
			conversationBody.callback_url = webhookUrl;
		}

		const tavusResponse = await fetch(
			`${TAVUS_DEFAULTS.API_BASE_URL}/conversations`,
			{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": apiKey,
			},
			body: JSON.stringify(conversationBody),
		});

		if (!tavusResponse.ok) {
			const errorData = await tavusResponse.json().catch(() => ({}));
			console.error("Tavus API error:", {
				status: tavusResponse.status,
				statusText: tavusResponse.statusText,
				error: errorData,
			});
			return NextResponse.json(
				{ error: "Failed to create Tavus conversation" },
				{ status: tavusResponse.status }
			);
		}

		const data = await tavusResponse.json();

		return NextResponse.json({
			conversationUrl: data.conversation_url,
			conversationId: data.conversation_id,
			expiresAt: data.expires_at,
		});
	} catch (error) {
		console.error("Error creating conversation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Helper functions moved to @/lib/tavus/config.ts for centralized configuration
// - buildGreeting(chapterTitle): Creates custom greeting
// - buildChapterContext(chapterId, chapterTitle): Builds chapter-specific context
