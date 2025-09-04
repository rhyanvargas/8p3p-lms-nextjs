"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface WidgetCardProps {
	title: string;
	footerContent?: React.ReactNode;
	showViewAll?: boolean;
	onViewAll?: () => void;
	children: React.ReactNode;
	className?: string;
}

export function WidgetCard({
	title,
	footerContent,
	showViewAll = false,
	onViewAll,
	children,
	className,
}: WidgetCardProps) {
	return (
		<Card className={`overflow-hidden ${className || ""}`}>
			<CardHeader className="pb-0">
				<div className="flex justify-between items-center">
					<CardTitle className="text-lg font-medium">{title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent>{children}</CardContent>
			{footerContent && <CardFooter>{footerContent}</CardFooter>}
			{showViewAll && (
				<div className="flex justify-center">
					<Button
						variant="link"
						onClick={onViewAll}
						className="text-accent hover:underline"
					>
						View All
					</Button>
				</div>
			)}
		</Card>
	);
}
