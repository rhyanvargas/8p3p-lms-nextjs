import { Navbar } from "@/components/ui/navbar";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
	return (
		<div className="bg-primary">
			<Navbar />
			<div className="min-h-screen flex items-center justify-center">
				<SignupForm className="max-w-sm" />
			</div>
		</div>
	);
}
