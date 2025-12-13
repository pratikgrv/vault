"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useUsernameValidation } from "@/hooks/useUsernameValidation";

export default function OnboardingPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Live username validation
	const {
		status: usernameStatus,
		error: usernameError,
		isValid: isUsernameValid,
		isChecking: isCheckingUsername,
	} = useUsernameValidation(username);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Check if username is valid before proceeding
		if (!isUsernameValid) {
			toast.error(usernameError || "Please enter a valid username");
			return;
		}

		setIsSubmitting(true);

		try {
			// Call API to update username
			const response = await fetch("/api/username/update", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to update username");
			}

			// Success! Redirect to user's profile
			toast.success("Account setup complete! 🎉");
			router.push(`/${username}`);
		} catch (error: any) {
			toast.error(error.message || "Something went wrong. Please try again.");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* Left Side - Visual */}
			<div className="hidden lg:flex flex-col justify-center items-center bg-muted p-12 relative overflow-hidden">
				<div className="z-10 text-center max-w-lg">
					<h1 className="text-4xl font-bold mb-6 text-foreground">
						Welcome to Vault! 🎉
					</h1>
					<p className="text-xl text-muted-foreground">
						You're almost there! Just choose a username to complete your account
						setup.
					</p>
				</div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 rounded-full blur-3xl opacity-50 pointer-events-none" />
			</div>

			{/* Right Side - Form */}
			<div className="flex flex-col justify-center p-8 lg:p-12">
				<div className="max-w-md w-full mx-auto space-y-8">
					<div className="text-center lg:text-left">
						<Link href="/" className="inline-block mb-8">
							<div className="flex items-center gap-2">
								<div className="h-6 w-6 bg-foreground rounded-full" />
								<span className="text-lg font-bold text-foreground">Vault</span>
							</div>
						</Link>
						<h2 className="text-2xl font-bold tracking-tight text-foreground">
							Choose your username
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							This will be your unique link: vault.bio/
							<span className="font-medium text-foreground">
								{username || "username"}
							</span>
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
									vault.bio/
								</span>
								<Input
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className={`pl-24 pr-10 ${
										usernameStatus === "available"
											? "border-green-500 focus-visible:ring-green-500"
											: usernameStatus === "taken" ||
											  usernameStatus === "invalid"
											? "border-red-500 focus-visible:ring-red-500"
											: ""
									}`}
									placeholder="username"
									autoFocus
									required
									minLength={3}
								/>
								{/* Live validation indicator */}
								<div className="absolute right-3 top-1/2 -translate-y-1/2">
									{isCheckingUsername && (
										<Loader2 className="h-4 w-4 animate-spin text-gray-400" />
									)}
									{usernameStatus === "available" && (
										<CheckCircle2 className="h-4 w-4 text-green-500" />
									)}
									{(usernameStatus === "taken" ||
										usernameStatus === "invalid") && (
										<XCircle className="h-4 w-4 text-red-500" />
									)}
								</div>
							</div>
							{/* Status message */}
							{usernameStatus === "available" && (
								<p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
									<CheckCircle2 className="h-3 w-3" />
									Username is available!
								</p>
							)}
							{usernameError &&
								(usernameStatus === "taken" ||
									usernameStatus === "invalid") && (
									<p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
										<XCircle className="h-3 w-3" />
										{usernameError}
									</p>
								)}
							{isCheckingUsername && (
								<p className="text-sm text-muted-foreground">
									Checking availability...
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
							disabled={!isUsernameValid || isCheckingUsername || isSubmitting}
						>
							{(isCheckingUsername || isSubmitting) && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{isSubmitting ? "Setting up..." : "Complete Setup"}
						</Button>
					</form>

					<div className="text-center text-sm text-muted-foreground">
						<p>
							By continuing, you agree to our{" "}
							<Link href="/terms" className="underline hover:text-foreground">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link href="/privacy" className="underline hover:text-foreground">
								Privacy Policy
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
