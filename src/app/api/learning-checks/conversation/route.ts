import { NextRequest, NextResponse } from 'next/server';

/**
 * Create Tavus Conversation for Learning Check
 * 
 * Phase 1: Basic conversation creation with chapter context
 * Phase 2: Add webhook URL for perception analysis
 * 
 * @see specs/features/learning-check/learning-check-implementation.md
 */

interface CreateConversationRequest {
  chapterId: string;
  chapterTitle: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateConversationRequest = await request.json();
    const { chapterId, chapterTitle } = body;

    // Validate required fields
    if (!chapterId || !chapterTitle) {
      return NextResponse.json(
        { error: 'Missing required fields: chapterId, chapterTitle' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const apiKey = process.env.TAVUS_API_KEY;
    const personaId = process.env.TAVUS_PERSONA_ID;

    if (!apiKey || !personaId) {
      console.error('Missing Tavus configuration:', { 
        hasApiKey: !!apiKey, 
        hasPersonaId: !!personaId 
      });
      return NextResponse.json(
        { error: 'Tavus configuration missing. Please set TAVUS_API_KEY and TAVUS_PERSONA_ID.' },
        { status: 500 }
      );
    }

    // Build chapter-specific context for AI instructor
    const conversationalContext = buildChapterContext(chapterId, chapterTitle);

    // Create Tavus conversation with minimal required fields
    // Note: properties and max_call_duration are not supported in Tavus API v2
    const tavusResponse = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        persona_id: personaId,
        conversational_context: conversationalContext,
        conversation_name: `Learning Check: ${chapterTitle}`,
        // Phase 2: Add callback_url for perception analysis webhook
        // callback_url: process.env.TAVUS_WEBHOOK_URL,
      })
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      console.error('Tavus API error:', {
        status: tavusResponse.status,
        statusText: tavusResponse.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: 'Failed to create Tavus conversation' },
        { status: tavusResponse.status }
      );
    }

    const data = await tavusResponse.json();

    return NextResponse.json({
      conversationUrl: data.conversation_url,
      conversationId: data.conversation_id,
      expiresAt: data.expires_at
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Build chapter-specific context for AI instructor
 * This context is injected into the Tavus persona at conversation creation
 */
function buildChapterContext(chapterId: string, chapterTitle: string): string {
  // TODO: In production, fetch actual chapter data from database
  // For Phase 1, use static context
  
  return `
Current Learning Check Context:
Chapter: ${chapterTitle}
Chapter ID: ${chapterId}

Time Constraint:
- This conversation will automatically end after 4 minutes
- Keep your questions concise and pace the conversation accordingly
- Aim to ask 3-4 questions total within the time limit

Learning Objectives for This Chapter:
- Understand the core concepts covered in this chapter
- Apply knowledge to real-world scenarios
- Explain concepts in your own words

Assessment Focus:
- Ask at least 1 recall question about key concepts from this chapter
- Ask at least 1 application question about real-world usage
- Ask at least 1 self-explanation question to check understanding
- IMPORTANT: Never reveal quiz answers or discuss specific quiz questions
- Keep conversation focused on this chapter's content
- Politely redirect if student asks about topics outside this chapter's scope

Conversation Guidelines:
- Be encouraging and supportive
- Use natural, conversational language
- Keep responses brief (1-2 sentences maximum)
- Ask follow-up questions to deepen understanding
- Acknowledge good answers positively
- Gently correct misconceptions without being discouraging
- Move efficiently through questions to respect the 4-minute time limit
`.trim();
}
