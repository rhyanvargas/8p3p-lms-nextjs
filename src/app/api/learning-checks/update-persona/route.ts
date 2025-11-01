import { NextRequest, NextResponse } from 'next/server';
import { PERSONA_CONFIG } from '@/lib/tavus';

/**
 * Update Tavus Persona to align with Learning Check structured approach
 * 
 * This updates the persona to work harmoniously with objectives and guardrails
 * rather than conflicting with them.
 * 
 * @see src/lib/tavus/config.ts for persona configuration
 */

interface UpdatePersonaRequest {
  persona_id: string;
  system_prompt?: string;
  context?: string;
  objectives_id?: string;
  guardrails_id?: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const body: UpdatePersonaRequest = await request.json();
    const { persona_id, objectives_id, guardrails_id } = body;

    if (!persona_id) {
      return NextResponse.json(
        { error: 'persona_id is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TAVUS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'TAVUS_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    // Use centralized persona configuration
    const updatedSystemPrompt = PERSONA_CONFIG.system_prompt;
    const updatedContext = PERSONA_CONFIG.context;

    // Build JSON Patch operations array (per Tavus PATCH API spec)
    const patchOperations: any[] = [
      {
        op: 'replace',
        path: '/system_prompt',
        value: updatedSystemPrompt
      },
      {
        op: 'replace',
        path: '/context',
        value: updatedContext
      }
    ];

    // Add objectives_id if provided
    if (objectives_id) {
      patchOperations.push({
        op: 'add',
        path: '/objectives_id',
        value: objectives_id
      });
    }

    // Add guardrails_id if provided
    if (guardrails_id) {
      patchOperations.push({
        op: 'add',
        path: '/guardrails_id',
        value: guardrails_id
      });
    }

    console.log('🎭 Updating persona with JSON Patch operations:', {
      persona_id,
      operations: patchOperations.map(op => `${op.op} ${op.path}`)
    });

    const tavusResponse = await fetch(`https://tavusapi.com/v2/personas/${persona_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(patchOperations)
    });

    if (!tavusResponse.ok) {
      const errorData = await tavusResponse.json().catch(() => ({}));
      console.error('Tavus Persona Update API error:', {
        status: tavusResponse.status,
        statusText: tavusResponse.statusText,
        error: errorData
      });
      return NextResponse.json(
        { error: 'Failed to update Tavus persona' },
        { status: tavusResponse.status }
      );
    }

    const data = await tavusResponse.json();

    return NextResponse.json({
      personaId: data.persona_id,
      personaName: data.persona_name,
      status: data.status,
      updatedAt: data.updated_at,
      hasObjectives: !!objectives_id,
      hasGuardrails: !!guardrails_id
    });

  } catch (error) {
    console.error('Error updating persona:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
