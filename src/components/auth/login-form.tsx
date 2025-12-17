"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<typeof Card>) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		const { error } = await authClient.signIn.email({
			email,
			password,
			callbackURL: "/dashboard",
			rememberMe,
		});

		if (error) {
			setError(error.message ?? "Unable to sign in.");
			setSubmitting(false);
			return;
		}

		router.push("/dashboard");
	};
	return (
		<Card className={cn("w-full flex flex-col gap-6", className)} {...props}>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
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
						</Field>
						<Field>
							<div className="flex items-center">
								<FieldLabel htmlFor="password">Password</FieldLabel>
								<a
									href="#"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</a>
							</div>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							<Field className="flex-row flex items-center gap-2">
								<Checkbox
									className="max-w-4 max-h-4"
									id="remember"
									onClick={() => {
										setRememberMe(!rememberMe);
									}}
								/>
								<FieldLabel className="" htmlFor="remember">
									Remember me
								</FieldLabel>
							</Field>
						</Field>
						<Field className="py-6">
							{error ? (
								<p className="text-sm text-destructive mb-2">{error}</p>
							) : null}
							<Button type="submit" disabled={submitting}>
								{submitting ? "Logging in..." : "Login"}
							</Button>
							<FieldDescription className="text-center">
								Don&apos;t have an account? <a href="/signup">Sign up</a>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
