/**
 * Tavus Configuration for Learning Check Feature
 *
 * Centralized configuration for Tavus Conversational Video Interface (CVI)
 * including objectives, guardrails, and persona settings.
 *
 * This file serves as the single source of truth for all Tavus-related
 * configurations, making it easy to:
 * - Update configurations in one place
 * - Maintain consistency across API routes and scripts
 * - Version control configuration changes
 * - Share configurations between environments
 *
 * @see https://docs.tavus.io/
 */

/**
 * Learning Check Objectives Configuration
 *
 * Defines the structured assessment sequence that the AI must follow:
 * recall → application → self-explanation
 */
export const LEARNING_CHECK_OBJECTIVES = {
	name: "Learning Check Compliance Objectives",
	data: [
		{
			objective_name: "recall_assessment",
			objective_prompt:
				"Ask at least one recall question about key concepts from this chapter to test memory of fundamentals.",
			confirmation_mode: "auto",
			modality: "verbal",
			output_variables: ["recall_key_terms", "recall_score"],
			next_required_objectives: ["application_assessment"],
		},
		{
			objective_name: "application_assessment",
			objective_prompt:
				"Ask at least one application question about using these concepts in realistic scenarios or therapeutic practice.",
			confirmation_mode: "auto",
			modality: "verbal",
			output_variables: ["application_example", "application_score"],
			next_required_objectives: ["self_explanation_assessment"],
		},
		{
			objective_name: "self_explanation_assessment",
			objective_prompt:
				"Ask at least one self-explanation prompt to assess deeper understanding in the learner’s own words.",
			confirmation_mode: "auto",
			modality: "verbal",
			output_variables: ["explanation_summary", "explanation_score"],
			// next_conditional_objectives: { "remediation_loop": "If explanation_score is low" } // optional
		},
	],
};

/**
 * Learning Check Guardrails Configuration
 *
 * Enforces strict behavioral boundaries:
 * - Quiz answer protection
 * - Time management
 * - Content scope
 * - Encouraging tone
 */
export const LEARNING_CHECK_GUARDRAILS = {
	name: "Learning Check Compliance Guardrails",
	data: [
		{
			guardrail_name: "quiz_answer_protection",
			guardrail_prompt:
				"Never reveal quiz answers or discuss specific quiz items. If asked, redirect to underlying concepts.",
			modality: "verbal",
		},
		{
			guardrail_name: "time_management",
			guardrail_prompt:
				"Keep responses brief and move efficiently; this session ends automatically when max conversation time is reached.",
			modality: "verbal",
		},
		{
			guardrail_name: "content_scope",
			guardrail_prompt:
				"Stay strictly within this chapter’s content. If off-scope, politely redirect to current chapter topics.",
			modality: "verbal",
		},
		{
			guardrail_name: "encouraging_tone",
			guardrail_prompt:
				"Maintain an encouraging, supportive tone. Acknowledge correct elements and correct misconceptions succinctly.",
			modality: "verbal",
		},
	],
};

/**
 * Persona Configuration
 *
 * Defines the AI Instructor Assistant personality and behavior
 */
export const PERSONA_CONFIG = {
	persona_name: "8p3p - AI Instructor Assistant",
	pipeline_mode: "full" as const,

	/**
	 * System Prompt
	 *
	 * Defines the AI's core behavior and personality.
	 * Updated to reference structured objectives and time constraints.
	 */
	system_prompt: `You are a knowledgeable and supportive course tutor. Speak naturally and conversationally, using clear examples and analogies to make complex ideas easy to grasp. Adapt to each student's pace with warmth and patience, encouraging curiosity and confidence. Keep a professional, friendly tone—never robotic or condescending—and guide learning through thoughtful questions and simple explanations.

Follow the structured assessment objectives to ensure comprehensive learning evaluation. Keep responses concise (1-2 sentences) to respect the 3-minute conversation limit while maintaining educational quality.`,

	/**
	 * Context
	 *
	 * Provides conversation-specific guidance.
	 * Updated to work harmoniously with guardrails (no hardcoded redirects).
	 */
	context: `You're having a 3-minute video conversation with a student about their current chapter material. This is a Conversational Video Interface for real-time learning support. Your role is to help students understand course concepts, answer questions, and guide them through challenging topics.

Follow the structured assessment sequence provided by the objectives to evaluate understanding comprehensively.

Maintain accuracy based on the provided materials in the knowledge base. Ask open-ended questions to check understanding. Provide examples and explanations that connect to the learning objectives. If you notice the student seems confused, offer to explain the concept differently or break it down into smaller parts.`,

	/**
	 * Layers Configuration
	 *
	 * Configures perception, TTS, LLM, and STT layers
	 */
	layers: {
		perception: {
			perception_model: "raven-0",
			ambient_awareness_queries: [
				"On a scale of 1-100, how often was the learner looking at the screen during the conversation?",
				"What was the learner's overall engagement level? (e.g., attentive, distracted, thoughtful, confused)",
				"Were there any visual indicators of comprehension struggles? (e.g., confusion, frustration)",
				"Did the learner appear to be taking notes or referencing materials?",
				"Was there any indication of multiple people present or distractions in the environment?",
				"How would you rate the learner's body language and facial expressions? (e.g., engaged, neutral, disengaged)",
			],
		},
		tts: {
			tts_model_name: "sonic-2",
		},
		llm: {
			model: "tavus-llama",
			speculative_inference: true,
		},
		stt: {
			stt_engine: "tavus-advanced",
			participant_pause_sensitivity: "high",
			participant_interrupt_sensitivity: "medium",
			smart_turn_detection: true,
		},
	},

	/**
	 * Additional Configuration
	 */
	document_tags: ["8p3p-ch1-demo"],
	greeting: "", // Custom greeting set per conversation
};

/**
 * Conversation Context Builder
 *
 * Builds chapter-specific context for AI instructor.
 * This is injected into each conversation at creation time.
 */
export function buildChapterContext(
	chapterId: string,
	chapterTitle: string
): string {
	// TODO: In production, fetch actual chapter data from database
	return [
		"Mode: Learning Check",
		`Chapter: ${chapterTitle} (${chapterId})`,
		"Goals: confirm recall, application, and ability to explain concepts.",
		"Flow: 1 recall → 1 application → 1 self-explanation → brief summary.",
		"Constraints: stay in chapter; do not reveal quiz answers; keep replies concise and supportive.",
	].join(" | ");
}

/**
 * Greeting Builder
 *
 * Builds a custom greeting for each conversation.
 * This is the first thing the AI will say when the learner joins.
 */
export function buildGreeting(chapterTitle: string): string {
	return `Hi! I'm excited to chat with you about ${chapterTitle}. Let's have a conversation to reinforce what you've learned. Ready to dive in?`;
}

/**
 * Default Configuration Values
 *
 * These are application-level constants that don't change between environments.
 * Deployment-specific values (API keys, IDs) should be in environment variables.
 */
export const TAVUS_DEFAULTS = {
	/** API base URL */
	API_BASE_URL: "https://tavusapi.com/v2",

	/** Default replica ID (can be overridden) */
	DEFAULT_REPLICA_ID: "r9fa0878977a",

	/** Learning Check session duration in seconds (3 minutes) */
	LEARNING_CHECK_DURATION: 180,

	/** Maximum concurrent learning check sessions (cost management) */
	MAX_CONCURRENT_SESSIONS: 10,

	/** Minimum engagement threshold (50% of session) */
	ENGAGEMENT_THRESHOLD: 90,

	/** Conversation timeout in seconds (auto-end if no activity) */
	CONVERSATION_TIMEOUT: 60,

	/** Test mode flag (set to true for development) */
	TEST_MODE: false,
} as const;

/**
 * Environment Variable Helpers
 *
 * Type-safe accessors for environment variables with fallbacks to defaults.
 * Use these instead of accessing process.env directly.
 */
export const TAVUS_ENV = {
	/** Get Tavus API key from environment */
	getApiKey: (): string | undefined => process.env.TAVUS_API_KEY,

	/** Get persona ID from environment */
	getPersonaId: (): string | undefined => process.env.TAVUS_PERSONA_ID,

	/** Get learning check duration (with fallback to default) */
	getLearningCheckDuration: (): number => {
		const envValue = process.env.TAVUS_LEARNING_CHECK_DURATION;
		return envValue
			? parseInt(envValue, 10)
			: TAVUS_DEFAULTS.LEARNING_CHECK_DURATION;
	},

	/** Get max concurrent sessions (with fallback to default) */
	getMaxConcurrentSessions: (): number => {
		const envValue = process.env.TAVUS_MAX_CONCURRENT_SESSIONS;
		return envValue
			? parseInt(envValue, 10)
			: TAVUS_DEFAULTS.MAX_CONCURRENT_SESSIONS;
	},

	/** Get webhook secret from environment */
	getWebhookSecret: (): string | undefined => process.env.TAVUS_WEBHOOK_SECRET,

	/** Get webhook URL from environment */
	getWebhookUrl: (): string | undefined => process.env.TAVUS_WEBHOOK_URL,

	/** Get objectives ID from environment */
	getObjectivesId: (): string | undefined =>
		process.env.NEXT_PUBLIC_TAVUS_LEARNING_CHECK_OBJECTIVES_ID,

	/** Get guardrails ID from environment */
	getGuardrailsId: (): string | undefined =>
		process.env.NEXT_PUBLIC_TAVUS_LEARNING_CHECK_GUARDRAILS_ID,
} as const;
