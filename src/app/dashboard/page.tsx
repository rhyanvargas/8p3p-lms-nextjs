import Image from "next/image";

export default function Page() {
	return (
		<div className="flex justify-between items-center mb-4">
			<div>
				<h1>Welcome back, Sarah Johnson</h1>
				<p className="mt-2 text-gray-600">
					Continue your EMDR training journey where you left off.
				</p>
			</div>
			<div className="flex items-center gap-3">
				<div className="w-12 h-12 rounded-full border-2 border-yellow-500 overflow-hidden">
					<Image
						width={48}
						height={48}
						src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
						alt="Sarah Johnson"
						className="w-full h-full object-cover"
					/>
				</div>
				<div>
					<p className="font-medium">Sarah Johnson</p>
					<p className="text-sm text-gray-600">Student</p>
				</div>
			</div>
		</div>
	);
}
