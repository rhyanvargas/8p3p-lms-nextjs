/**
 * Tavus API Types
 * 
 * Type definitions for Tavus Conversational Video Interface (CVI) integration
 * 
 * @see https://docs.tavus.io/api-reference/conversations/create-conversation
 */

/**
 * Conversational context configuration for AI instructor
 * 
 * @interface ConversationalContextConfig
 * @description Defines how the AI instructor should behave and respond
 */
export interface ConversationalContextConfig {
	/** Tone of the AI instructor */
	instructorTone: 'professional' | 'conversational' | 'encouraging';
	/** Key concepts to emphasize in responses */
	keyConcepts: string[];
	/** Target response length */
	responseLength: 'brief' | 'moderate' | 'detailed';
	/** Custom instructions for AI behavior */
	customInstructions?: string;
}

/**
 * Request payload for creating a Tavus conversation
 * 
 * @interface CreateConversationRequest
 * @description Sent to /api/tavus/conversation endpoint
 */
export interface CreateConversationRequest {
	/** Chapter ID for context */
	chapterId: string;
	/** Course ID for broader context */
	courseId: string;
	/** Chapter title for AI context */
	chapterTitle: string;
	/** Optional time limit override (default: from env) */
	timeLimit?: number;
	/** Optional persona ID override */
	personaId?: string;
}

/**
 * Response from Tavus conversation creation
 * 
 * @interface CreateConversationResponse
 * @description Returned from /api/tavus/conversation endpoint
 */
export interface CreateConversationResponse {
	/** Tavus conversation URL for embedding */
	conversationUrl: string;
	/** Unique conversation ID */
	conversationId: string;
	/** Conversation expiration timestamp */
	expiresAt: string;
}

/**
 * Tavus API conversation creation payload
 * 
 * @interface TavusConversationPayload
 * @description Sent to Tavus API
 * @see https://docs.tavus.io/api-reference/conversations/create-conversation
 */
export interface TavusConversationPayload {
	/** Tavus replica ID (AI avatar) */
	replica_id: string;
	/** Optional persona ID for custom AI personality */
	persona_id?: string;
	/** Context string for AI instructor */
	conversational_context: string;
	/** Maximum call duration in seconds */
	max_call_duration: number;
	/** Custom properties for tracking */
	properties?: {
		chapterId: string;
		courseId: string;
		chapterTitle: string;
	};
}

/**
 * Tavus API conversation response
 * 
 * @interface TavusConversationAPIResponse
 * @description Response from Tavus API
 */
export interface TavusConversationAPIResponse {
	/** Conversation URL for embedding */
	conversation_url: string;
	/** Unique conversation ID */
	conversation_id: string;
	/** Expiration timestamp */
	expires_at: string;
}

/**
 * Conversation analytics data
 * 
 * @interface ConversationAnalytics
 * @description Tracks Q&A session metrics
 */
export interface ConversationAnalytics {
	/** Unique conversation ID from Tavus */
	conversationId: string;
	/** Chapter context */
	chapterId: string;
	/** Course context */
	courseId: string;
	/** User who initiated conversation */
	userId: string;
	/** Conversation start time */
	startedAt: Date;
	/** Conversation end time */
	endedAt: Date;
	/** Duration in seconds */
	duration: number;
	/** Number of questions asked */
	questionCount: number;
	/** Network quality during call */
	networkQuality: 'poor' | 'fair' | 'good' | 'excellent';
	/** Device issues encountered */
	deviceIssues: string[];
}

/**
 * Error response from Tavus API
 * 
 * @interface TavusErrorResponse
 * @description Standard error format
 */
export interface TavusErrorResponse {
	/** Error message */
	error: string;
	/** HTTP status code */
	status: number;
	/** Additional error details */
	details?: unknown;
}
