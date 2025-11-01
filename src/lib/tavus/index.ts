/**
 * Tavus Library
 * 
 * Centralized exports for Tavus Conversational Video Interface (CVI) integration.
 * 
 * Usage:
 * ```typescript
 * import { 
 *   LEARNING_CHECK_OBJECTIVES, 
 *   LEARNING_CHECK_GUARDRAILS,
 *   PERSONA_CONFIG,
 *   buildChapterContext,
 *   buildGreeting,
 *   TAVUS_DEFAULTS,
 *   TAVUS_ENV
 * } from '@/lib/tavus';
 * ```
 */

export {
	LEARNING_CHECK_OBJECTIVES,
	LEARNING_CHECK_GUARDRAILS,
	PERSONA_CONFIG,
	buildChapterContext,
	buildGreeting,
	TAVUS_DEFAULTS,
	TAVUS_ENV,
} from "./config";

// Re-export types for convenience
export type {
	ConversationalContextConfig,
	CreateConversationRequest,
	CreateConversationResponse,
	TavusConversationPayload,
	TavusConversationAPIResponse,
	ConversationAnalytics,
	TavusErrorResponse,
} from "@/types/tavus";
