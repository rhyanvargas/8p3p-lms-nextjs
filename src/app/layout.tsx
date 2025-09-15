import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/auth/AuthProvider";
import SessionHandler from "@/components/auth/SessionHandler";
import EmailVerificationHandler from "@/components/auth/EmailVerificationHandler";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
	title: "8P3P LMS",
	description:
		"A learning management system for EMDR therapist training through immersive technology and adaptive AI patient simulations.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen">
				<ThemeProvider attribute="class" defaultTheme="light">
					<AuthProvider>
						<SessionHandler />
						<EmailVerificationHandler />

						{children}
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
