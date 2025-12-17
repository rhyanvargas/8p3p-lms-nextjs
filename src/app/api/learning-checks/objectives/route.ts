import { NextRequest, NextResponse } from 'next/server';
import { LEARNING_CHECK_OBJECTIVES } from '@/lib/tavus';

/**
 * Create Tavus Objectives for Learning Check Assessment
 * 
 * These objectives provide structured enforcement of the assessment requirements:
 * 1. Recall question about key concepts
 * 2. Application question about real-world usage  
 * 3. Self-explanation question to check understanding
 * 
 * Objectives are created once and reused across all learning checks
 * 
 * @see src/lib/tavus/config.ts for objective definitions
 */

export async function POST(_request: NextRequest) {
  try {
    const apiKey = process.env.TAVUS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'TAVUS_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    // Use centralized objectives configuration
    const objectives = LEARNING_CHECK_OBJECTIVES;

    const tavusResponse = await fetch('https://tavusapi.com/v2/objectives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        data: objectives
      })
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      console.error('Tavus Objectives API error:', {
        status: tavusResponse.status,
        statusText: tavusResponse.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: 'Failed to create Tavus objectives' },
        { status: tavusResponse.status }
      );
    }

    const data = await tavusResponse.json();

    return NextResponse.json({
      objectivesId: data.objectives_id,
      objectivesName: data.objectives_name,
      status: data.status,
      createdAt: data.created_at,
      objectives: data.objectives || objectives
    });

  } catch (error) {
    console.error('Error creating objectives:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
