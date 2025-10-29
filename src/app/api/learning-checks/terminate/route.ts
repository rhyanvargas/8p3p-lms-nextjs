import { NextRequest, NextResponse } from 'next/server';

/**
 * Terminate Tavus Conversation
 * 
 * Critical for cost management: Always end conversations when:
 * - Timer expires
 * - User manually ends session
 * - User navigates away
 * - Component unmounts
 * - Connection lost
 * 
 * @see specs/features/learning-check/learning-check-spec.md#conversation-termination--cost-management
 */

interface TerminateConversationRequest {
  conversationId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TerminateConversationRequest = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing required field: conversationId' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TAVUS_API_KEY;

    if (!apiKey) {
      console.error('Missing TAVUS_API_KEY');
      return NextResponse.json(
        { error: 'Tavus configuration missing' },
        { status: 500 }
      );
    }

    // Call Tavus API to end conversation
    const tavusResponse = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}`,
      {
        method: 'DELETE',
        headers: {
          'x-api-key': apiKey,
        }
      }
    );

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      console.error('Tavus termination error:', {
        conversationId,
        status: tavusResponse.status,
        error: errorData
      });
      
      // Don't fail the request if conversation is already ended
      if (tavusResponse.status === 404) {
        return NextResponse.json({ 
          success: true, 
          message: 'Conversation already ended' 
        });
      }

      return NextResponse.json(
        { error: 'Failed to terminate conversation' },
        { status: tavusResponse.status }
      );
    }

    console.log('✅ Conversation terminated:', conversationId);

    return NextResponse.json({ 
      success: true,
      conversationId 
    });

  } catch (error) {
    console.error('Error terminating conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
