"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { authClient } from "@/lib/auth-client";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session, isPending } = authClient.useSession();
	const isAuthenticated = !!session?.user;

	useEffect(() => {
		if (!isPending && !isAuthenticated) {
			// Store intended destination for post-login redirect
			sessionStorage.setItem("redirectAfterLogin", pathname);
			router.push("/login");
		}
	}, [isAuthenticated, isPending, router, pathname]);

	// Show loading while checking auth status
	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<LoadingSpinner size="lg" />
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Only render children if authenticated
	if (isAuthenticated) {
		return <>{children}</>;
	}

	// Return null while redirecting
	return null;
}
