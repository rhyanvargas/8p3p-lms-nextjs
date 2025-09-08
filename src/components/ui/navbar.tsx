"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserIcon, LogOut } from "lucide-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
	SheetHeader,
} from "@/components/ui/sheet";

interface NavItem {
	title: string;
	href: string;
}

const navItems: NavItem[] = [
	{
		title: "Solutions",
		href: "/solutions",
	},
	{
		title: "Platform",
		href: "/platform",
	},
	{
		title: "Resources",
		href: "/resources",
	},
	{
		title: "Pricing",
		href: "/pricing",
	},
];

const navButtons: NavItem[] = [
	{
		title: "Login",
		href: "/login",
	},
	{
		title: "Schedule a Demo",
		href: "/demo",
	},
];

export function Navbar() {
	const pathname = usePathname();
	const isMobile = useIsMobile();
	const { authStatus } = useAuthenticator();

	const handleSignOut = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	return (
		<header className="w-full backdrop-blur-md bg-primary/50 border-b border-white/10 sticky top-0 z-50">
			<div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6 lg:px-8">
				{/* Logo */}
				<div className="flex items-center">
					<Link href="/" className="flex items-center space-x-2">
						<div className="h-8 w-8 rounded-full bg-[var(--brand-gold-hex)] flex items-center justify-center">
							<span className="font-bold text-[var(--brand-blue-hex)]">8P</span>
						</div>
						<span className="font-semibold hidden sm:inline-block text-white">
							8P3P Training
						</span>
					</Link>
				</div>

				{/* Desktop navigation - centered */}
				<nav className="hidden md:flex items-center justify-center space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-accent/80",
								pathname === item.href
									? "text-white font-semibold"
									: authStatus === "authenticated" 
										? "text-white/60 hover:text-white/80" 
										: "text-white"
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>

				{/* Right side - Auth-aware buttons */}
				<div className="flex items-center space-x-2">
					{authStatus === "authenticated" ? (
						<>
							{/* Dashboard link */}
							<Button variant="ghost" asChild className="hidden md:flex">
								<Link href="/dashboard">Dashboard</Link>
							</Button>
							{/* Courses link */}
							<Button variant="ghost" asChild className="hidden md:flex">
								<Link href="/courses">Courses</Link>
							</Button>
							{/* Logout button */}
							<Button
								variant="outline"
								onClick={handleSignOut}
								className="hidden md:flex items-center space-x-1"
							>
								<LogOut className="h-4 w-4 mr-1" />
								Logout
							</Button>
						</>
					) : (
						<>
							{/* Login button */}
							<Button
								variant="ghost"
								asChild
								className="hidden md:flex items-center space-x-1"
							>
								<Link href="/login">
									<UserIcon className="h-4 w-4 mr-1" />
									Login
								</Link>
							</Button>
							{/* Demo button */}
							<Button variant="outline" asChild className="hidden md:flex">
								<Link href="/demo">Schedule a Demo</Link>
							</Button>
						</>
					)}

					{/* Mobile menu */}
					{isMobile && (
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden text-white"
								>
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[300px] sm:w-[400px]">
								<SheetHeader>
									<SheetTitle>Navigation Menu</SheetTitle>
								</SheetHeader>
								<nav className="flex flex-col gap-4 mt-4">
									{navItems.map((item) => (
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												"block px-2 py-1 text-lg hover:bg-brand-light-blue",
												authStatus === "authenticated" ? "opacity-60" : ""
											)}
										>
											{item.title}
										</Link>
									))}
									<div className="flex flex-col px-2 py-2 gap-2">
										{authStatus === "authenticated" ? (
											<>
												<Button asChild>
													<Link href="/dashboard">Dashboard</Link>
												</Button>
												<Button asChild>
													<Link href="/courses">Courses</Link>
												</Button>
												<Button variant="outline" onClick={handleSignOut}>
													<LogOut className="h-4 w-4 mr-1" />
													Logout
												</Button>
											</>
										) : (
											<>
												<Button asChild>
													<Link href="/login">Login</Link>
												</Button>
												<Button asChild>
													<Link href="/demo">Schedule a Demo</Link>
												</Button>
											</>
										)}
									</div>
								</nav>
							</SheetContent>
						</Sheet>
					)}
				</div>
			</div>
		</header>
	);
}
