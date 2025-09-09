"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmailVerificationHandler() {
	const { authStatus, user } = useAuthenticator();
	const router = useRouter();

	useEffect(() => {
		// Handle successful email verification
		if (authStatus === "authenticated" && user) {
			try {
				// Check browser environment and sessionStorage availability
				if (typeof window !== "undefined" && window.sessionStorage) {
					const isNewlyVerified = sessionStorage.getItem(
						"emailVerificationCompleted"
					);

					if (isNewlyVerified) {
						sessionStorage.removeItem("emailVerificationCompleted");
						// Redirect to dashboard after successful verification
						router.push("/dashboard");
					}
				}
			} catch (error) {
				// Handle sessionStorage errors (quota exceeded, disabled, etc.)
				console.warn("SessionStorage access failed:", error);
				// Fallback: redirect to dashboard anyway for verified users
				router.push("/dashboard");
			}
		}
	}, [authStatus, user, router]);

	// This component doesn't render anything
	return null;
}
