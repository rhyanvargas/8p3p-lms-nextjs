/**
 * Tavus Conversation API Route
 * 
 * Creates Tavus conversation sessions with chapter-specific context
 * 
 * @route POST /api/tavus/conversation
 * @body {CreateConversationRequest}
 * @returns {CreateConversationResponse}
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/tavus/conversation', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     chapterId: 'ch-1',
 *     courseId: 'course-1',
 *     chapterTitle: 'EMDR Foundations',
 *     timeLimit: 240
 *   })
 * });
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
	CreateConversationRequest,
	CreateConversationResponse,
	TavusConversationPayload,
	TavusConversationAPIResponse,
} from '@/types/tavus';

/**
 * POST /api/tavus/conversation
 * 
 * Creates a new Tavus conversation session with chapter context
 * 
 * @param request - Next.js request object
 * @returns Conversation URL and metadata
 */
export async function POST(request: NextRequest) {
	try {
		// Parse request body
		const body: CreateConversationRequest = await request.json();
		const { chapterId, courseId, chapterTitle, timeLimit, personaId } = body;

		// Validate required fields
		if (!chapterId || !courseId || !chapterTitle) {
			return NextResponse.json(
				{ error: 'Missing required fields: chapterId, courseId, chapterTitle' },
				{ status: 400 }
			);
		}

		// Validate environment variables
		const apiKey = process.env.TAVUS_API_KEY;
		const replicaId = process.env.TAVUS_REPLICA_ID;
		const defaultPersonaId = process.env.TAVUS_PERSONA_ID;
		const defaultCallDuration = parseInt(
			process.env.TAVUS_DEFAULT_CALL_DURATION || '240',
			10
		);

		if (!apiKey || !replicaId) {
			console.error('Missing required Tavus environment variables');
			return NextResponse.json(
				{
					error:
						'Tavus API not configured. Please set TAVUS_API_KEY and TAVUS_REPLICA_ID.',
				},
				{ status: 500 }
			);
		}

		// Generate conversational context
		const conversationalContext = generateConversationalContext({
			chapterTitle,
			chapterId,
		});

		// Prepare Tavus API payload
		const tavusPayload: TavusConversationPayload = {
			replica_id: replicaId,
			persona_id: personaId || defaultPersonaId,
			conversational_context: conversationalContext,
			max_call_duration: timeLimit || defaultCallDuration,
			properties: {
				chapterId,
				courseId,
				chapterTitle,
			},
		};

		// Call Tavus API to create conversation
		const tavusResponse = await fetch(
			'https://tavusapi.com/v2/conversations',
			{
				method: 'POST',
				headers: {
					'x-api-key': apiKey,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(tavusPayload),
			}
		);

		if (!tavusResponse.ok) {
			const errorData = await tavusResponse.json().catch(() => ({}));
			console.error('Tavus API error:', errorData);
			return NextResponse.json(
				{
					error: 'Failed to create Tavus conversation',
					details: errorData,
				},
				{ status: tavusResponse.status }
			);
		}

		const tavusData: TavusConversationAPIResponse = await tavusResponse.json();

		// Return conversation details
		const response: CreateConversationResponse = {
			conversationUrl: tavusData.conversation_url,
			conversationId: tavusData.conversation_id,
			expiresAt: tavusData.expires_at,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error creating Tavus conversation:', error);
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 }
		);
	}
}

/**
 * Generates conversational context string for Tavus AI
 * 
 * @param params - Chapter context parameters
 * @returns Formatted context string for AI instructor
 * 
 * Context includes:
 * - Chapter title and objectives
 * - Instructor tone and style
 * - Response guidelines
 * 
 * Future Enhancement: Fetch context from database or mock-data
 */
function generateConversationalContext(params: {
	chapterTitle: string;
	chapterId: string;
}): string {
	const { chapterTitle } = params;

	// TODO: Fetch conversationalContext from mock-data.ts based on chapterId
	// For now, use a general template

	return `
You are an expert EMDR therapy instructor helping a learner understand course content.

Current Chapter: ${chapterTitle}

Instruction Style:
- Be conversational and encouraging
- Use simple language to explain complex concepts
- Provide concrete examples when possible
- Ask clarifying questions if needed
- Keep responses concise (30-45 seconds)
- Reference chapter content when appropriate

Question Guidelines:
- Answer questions within the scope of this chapter
- If asked about other chapters, redirect to current content
- Encourage critical thinking with follow-up questions
- Validate student understanding with examples
`.trim();
}
