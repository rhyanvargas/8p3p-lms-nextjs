import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
	try {
		// Server-side auth check via Better Auth session
		const user = await requireAuth(request.headers as Headers);

		if (!user) {
			return NextResponse.json(
				{ success: false, error: "User not found" },
				{ status: 401 }
			);
		}

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch {
		return NextResponse.json(
			{ success: false, error: "Authentication required" },
			{ status: 401 }
		);
	}
}
