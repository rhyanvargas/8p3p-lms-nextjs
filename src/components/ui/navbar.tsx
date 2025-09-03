"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserIcon } from "lucide-react";

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

export function Navbar() {
	const pathname = usePathname();
	const isMobile = useIsMobile();

	return (
		<header className="sticky top-0 z-50 w-full bg-primary text-white">
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
									: "text-white"
							)}
						>
							{item.title}
						</Link>
					))}
				</nav>

				{/* Right side - Login and Demo buttons */}
				<div className="flex items-center space-x-2">
					{/* Search icon - removed based on image */}

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
											className="block px-2 py-1 text-lg hover:bg-brand-light-blue"
										>
											{item.title}
										</Link>
									))}
									<Link href="/login" className="block px-2 py-1 text-lg">
										Login
									</Link>
									<Link href="/demo" className="block px-2 py-1 text-lg">
										Schedule a Demo
									</Link>
								</nav>
							</SheetContent>
						</Sheet>
					)}
				</div>
			</div>
		</header>
	);
}
