import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, requireAuth } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
	try {
		// Server-side auth check
		const user = await requireAuth();

		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 401 }
			);
		}

		return NextResponse.json({
			success: true,
			user: {
				userId: user.userId,
				username: user.username,
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Authentication required" },
			{ status: 401 }
		);
	}
}
