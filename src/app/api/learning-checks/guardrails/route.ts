import { NextRequest, NextResponse } from 'next/server';
import { LEARNING_CHECK_GUARDRAILS } from '@/lib/tavus';

/**
 * Create Tavus Guardrails for Learning Check Compliance
 * 
 * These guardrails enforce strict behavioral boundaries:
 * 1. Quiz answer protection - never reveal quiz content
 * 2. Time management - keep responses brief and efficient
 * 3. Content scope - stay focused on chapter content
 * 4. Encouraging tone - maintain supportive interaction
 * 
 * Guardrails are created once and reused across all learning checks
 * 
 * @see src/lib/tavus/config.ts for guardrail definitions
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

    // Use centralized guardrails configuration
    const guardrailsConfig = LEARNING_CHECK_GUARDRAILS;

    const tavusResponse = await fetch('https://tavusapi.com/v2/guardrails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(guardrailsConfig)
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      console.error('Tavus Guardrails API error:', {
        status: tavusResponse.status,
        statusText: tavusResponse.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: 'Failed to create Tavus guardrails' },
        { status: tavusResponse.status }
      );
    }

    const data = await tavusResponse.json();

    return NextResponse.json({
      guardrailsId: data.guardrails_id,
      guardrailsName: data.guardrails_name,
      status: data.status,
      createdAt: data.created_at,
      guardrails: data.guardrails || guardrailsConfig.data
    });

  } catch (error) {
    console.error('Error creating guardrails:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
