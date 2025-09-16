import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-[calc(100vh-64px)]">
				{/* Left side with background image */}
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r justify-end items-end">
					<div className=" inset-0 bg-zinc-900 max-h-[calc(100vh-64px)]">
						<Image
							src="/emdr-xr-training.png"
							alt="EMDR XR Training"
							fill
							className="object-cover opacity-90"
						/>
					</div>

					{/* Testimonial Card */}
					<Card className="relative z-20 bg-transparent border-0 shadow-none backdrop-blur-md p-6">
						<CardContent className="p-0">
							<blockquote className="space-y-4 text-white/60">
								<p className="text-4xl">
									&ldquo;This platform has transformed how I approach EMDR
									therapy training, making complex concepts accessible and
									engaging.&rdquo;
								</p>
								<footer className="text-md">Dr. Sarah Johnson</footer>
							</blockquote>
						</CardContent>
					</Card>
				</div>

				{/* Right side with content */}
				<div className="h-full flex flex-col items-center justify-center lg:p-8 bg-background">
					<Card className="mx-auto w-full sm:w-[450px] border-0 shadow-none bg-transparent">
						<CardHeader className="space-y-4 text-center pb-0">
							<h1 className="text-4xl font-bold tracking-tight">
								Clinician Portal Training Platform
							</h1>
							<p className="text-xl text-muted-foreground">
								Advanced EMDR training for mental health professionals
							</p>
						</CardHeader>

						<CardContent className="pt-6">
							<Separator className="my-4" />
						</CardContent>

						<CardFooter className="flex justify-center pb-8">
							<Button
								variant="accent"
								size="lg"
								className="px-8 py-6 text-lg"
								asChild
							>
								<Link href="/login">Get Started</Link>
							</Button>
						</CardFooter>
					</Card>
				</div>
			</main>
		</>
	);
}
