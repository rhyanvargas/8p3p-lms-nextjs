import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/lib/auth-server";
import { fetchAuthSession } from "aws-amplify/auth/server";

const protectedRoutes = ["/dashboard", "/courses"];
const authRoutes = ["/login"];

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Skip auth check for static files and API routes
	if (
		request.nextUrl.pathname.startsWith("/_next") ||
		request.nextUrl.pathname.startsWith("/api") ||
		request.nextUrl.pathname.includes(".")
	) {
		return response;
	}

	try {
		const authenticated = await runWithAmplifyServerContext({
			nextServerContext: { request, response },
			operation: async (contextSpec) => {
				try {
					const session = await fetchAuthSession(contextSpec);
					return !!session.tokens?.accessToken;
				} catch (error) {
					return false;
				}
			},
		});

		const isProtectedRoute = protectedRoutes.some((route) =>
			request.nextUrl.pathname.startsWith(route)
		);
		const isAuthRoute = authRoutes.some((route) =>
			request.nextUrl.pathname.startsWith(route)
		);

		if (isProtectedRoute && !authenticated) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		if (isAuthRoute && authenticated) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		return response;
	} catch (error) {
		// If auth check fails, allow public routes but block protected ones
		const isProtectedRoute = protectedRoutes.some((route) =>
			request.nextUrl.pathname.startsWith(route)
		);

		if (isProtectedRoute) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		return response;
	}
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
