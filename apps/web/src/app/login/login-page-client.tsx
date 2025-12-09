"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { useState } from "react";

export default function LoginPageClient({
	pendingUsername,
}: {
	pendingUsername?: string;
}) {
	const [showSignIn, setShowSignIn] = useState(false);

	return showSignIn ? (
		<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
	) : (
		<SignUpForm
			onSwitchToSignIn={() => setShowSignIn(true)}
			pendingUsername={pendingUsername}
		/>
	);
}
