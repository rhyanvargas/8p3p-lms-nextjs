import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
	config: outputs,
});

export async function getAuthenticatedUser() {
	try {
		const currentUser = await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => getCurrentUser(contextSpec),
		});
		return currentUser;
	} catch {
		return null;
	}
}

export async function isAuthenticated(): Promise<boolean> {
	try {
		const session = await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => fetchAuthSession(contextSpec),
		});
		return !!session.tokens?.accessToken;
	} catch {
		return false;
	}
}

export async function requireAuth() {
	const authenticated = await isAuthenticated();
	if (!authenticated) {
		throw new Error("Authentication required");
	}
	return await getAuthenticatedUser();
}
