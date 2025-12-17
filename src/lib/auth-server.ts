import { auth } from "./auth";

async function getSessionFromHeaders(headers: Headers) {
	const session = await auth.api.getSession({
		headers,
	});
	return session;
}

export async function getAuthenticatedUser(headers: Headers) {
	const session = await getSessionFromHeaders(headers);
	return session?.user ?? null;
}

export async function isAuthenticated(headers: Headers): Promise<boolean> {
	const session = await getSessionFromHeaders(headers);
	return !!session?.user;
}

export async function requireAuth(headers: Headers) {
	const user = await getAuthenticatedUser(headers);
	if (!user) {
		throw new Error("Authentication required");
	}
	return user;
}
