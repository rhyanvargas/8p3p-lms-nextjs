"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
	label?: string;
}

export function BackButton({ label = "Go Back" }: BackButtonProps) {
	const router = useRouter();

	return (
		<Button type="button" onClick={() => router.back()}>
			{label}
		</Button>
	);
}
