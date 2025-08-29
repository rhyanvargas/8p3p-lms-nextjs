import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
			<body className="min-h-screen bg-background font-sans antialiased">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
