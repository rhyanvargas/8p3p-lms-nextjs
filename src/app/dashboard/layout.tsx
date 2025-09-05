"use client";

import AuthClient from "@/components/auth/AuthClient";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AuthClient>
			<main className="bg-primary min-h-screen">
				<div className="bg-background container max-w-7xl mx-auto min-h-screen px-8 py-20">
					{children}
				</div>
			</main>
		</AuthClient>
	);
}
