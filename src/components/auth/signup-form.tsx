"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<typeof Card>) {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setSubmitting(true);

		const { error } = await authClient.signUp.email({
			email,
			password,
			name,
			callbackURL: "/dashboard",
		});

		if (error) {
			setError(error.message ?? "Unable to create account.");
			setSubmitting(false);
			return;
		}

		router.push("/dashboard");
	};

	return (
		<Card className={cn("w-full flex flex-col gap-6", className)} {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Full Name</FieldLabel>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								required
								value={name}
								onChange={(event) => setName(event.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
							<FieldDescription>
								We&apos;ll use this to contact you. We will not share your email
								with anyone else.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							<FieldDescription>
								Must be at least 8 characters long.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="confirm-password">
								Confirm Password
							</FieldLabel>
							<Input
								id="confirm-password"
								type="password"
								required
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
							/>
							<FieldDescription>Please confirm your password.</FieldDescription>
						</Field>
						<FieldGroup className="py-6">
							<Field>
								{error ? (
									<p className="text-sm text-destructive mb-2">{error}</p>
								) : null}
								<Button type="submit" disabled={submitting}>
									{submitting ? "Creating account..." : "Create Account"}
								</Button>
								<FieldDescription className="px-6 text-center">
									Already have an account? <a href="/login">Sign in</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
