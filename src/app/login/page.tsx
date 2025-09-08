import { SignIn } from "@/components/auth/SignIn";
import AuthRedirect from "@/components/auth/AuthRedirect";

export default function LoginPage() {
	return (
		<AuthRedirect>
			<div className="min-h-screen flex items-center justify-center">
				<SignIn />
			</div>
		</AuthRedirect>
	);
}
