import { NextRequest, NextResponse } from "next/server";
import { TAVUS_ENV } from "@/lib/tavus";

/**
 * End Tavus Conversation
 * 
 * Server-side endpoint to safely end a conversation using the Tavus API.
 * API key is kept server-side only for security.
 * 
 * @route POST /api/learning-checks/conversation/[conversationId]/end
 * @see https://docs.tavus.io/api-reference/conversations/end-conversation
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ conversationId: string }> }
) {
	try {
		// Next.js 15: params is now a Promise and must be awaited
		const { conversationId } = await params;

		// Validate conversation ID
		if (!conversationId) {
			return NextResponse.json(
				{ error: "Conversation ID is required" },
				{ status: 400 }
			);
		}

		// Get API key from server environment (NEVER exposed to client)
		const apiKey = TAVUS_ENV.getApiKey();
		
		if (!apiKey) {
			console.error("❌ Tavus API key not configured");
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 }
			);
		}

		console.log("🛑 Ending Tavus conversation:", conversationId);

		// Call Tavus API to end conversation
		// Per Tavus docs: POST /v2/conversations/{conversation_id}/end
		const response = await fetch(
			`https://tavusapi.com/v2/conversations/${conversationId}/end`,
			{
				method: "POST", // Per Tavus API spec
				headers: {
					"x-api-key": apiKey,
				},
			}
		);

		if (!response.ok) {
			// Handle Tavus API errors
			const errorData = await response.json().catch(() => ({}));
			console.error("❌ Tavus API error:", {
				status: response.status,
				statusText: response.statusText,
				error: errorData,
			});

			// Return appropriate error
			if (response.status === 400) {
				return NextResponse.json(
					{ error: errorData.error || "Invalid conversation_id" },
					{ status: 400 }
				);
			}

			if (response.status === 401) {
				return NextResponse.json(
					{ message: errorData.message || "Invalid access token" },
					{ status: 401 }
				);
			}

			return NextResponse.json(
				{ error: "Failed to end conversation" },
				{ status: response.status }
			);
		}

		const data = await response.json().catch(() => ({}));
		console.log("✅ Conversation ended successfully:", conversationId);

		return NextResponse.json({
			success: true,
			conversation_id: conversationId,
			...data,
		});
	} catch (error) {
		console.error("❌ Error ending conversation:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
