import { SignIn } from "@/components/auth/SignIn";
import AuthRedirect from "@/components/auth/AuthRedirect";
import { Navbar } from "@/components/ui/navbar";

export default function LoginPage() {
	return (
		<AuthRedirect>
			<Navbar />
			<div className="min-h-screen flex items-center justify-center">
				<SignIn />
			</div>
		</AuthRedirect>
	);
}
