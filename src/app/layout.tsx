import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "8P3P",
	description:
		"a revolutionary Desktop/XR/AI platform that transforms EMDR therapist training through immersive technology and adaptive AI patient simulations.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">{children}</body>
		</html>
	);
}
