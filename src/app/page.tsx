import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
	return (
		<div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-zinc-900">
					<Image
						src="/emdr-xr-training.png"
						alt="EMDR XR Training"
						fill
						className="object-cover opacity-50"
					/>
				</div>
				<div className="relative z-20 flex items-center text-lg font-medium">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="mr-2 h-6 w-6"
					>
						<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
					</svg>
					8P3P LMS
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;This platform has transformed how I approach EMDR therapy
							training, making complex concepts accessible and engaging.&rdquo;
						</p>
						<footer className="text-sm">Dr. Sarah Johnson</footer>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[450px]">
					<div className="flex flex-col space-y-4 text-center">
						<h1 className="text-4xl font-bold tracking-tight">
							Clinician Portal Training Platform
						</h1>
						<p className="text-xl text-muted-foreground">
							Advanced EMDR training for mental health professionals
						</p>
					</div>

					<div className="flex justify-center">
						<Button size="lg" className="px-8 py-6 text-lg" asChild>
							<Link href="/dashboard">Start Here</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
