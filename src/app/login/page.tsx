import { LoginForm } from "@/components/auth/login-form";
import { Navbar } from "@/components/ui/navbar";

export default function LoginPage() {
	return (
		<div className="bg-primary">
			<Navbar />
			<div className="min-h-screen flex items-center justify-center">
				<LoginForm className="max-w-sm" />
			</div>
		</div>
	);
}
