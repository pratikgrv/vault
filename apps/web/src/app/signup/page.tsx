import { Suspense } from "react";
import SignupFlow from "./signup-flow";

export default function SignupPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
			<SignupFlow />
		</Suspense>
	);
}
