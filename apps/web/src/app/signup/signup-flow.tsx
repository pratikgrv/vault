"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { getAuthErrorMessage, shouldRedirectToLogin } from "@/lib/auth-errors";
import { useUsernameValidation } from "@/hooks/useUsernameValidation";

export default function SignupFlow() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSocialLoading, setIsSocialLoading] = useState(false);

	// Live username validation
	const {
		status: usernameStatus,
		error: usernameError,
		isValid: isUsernameValid,
		isChecking: isCheckingUsername,
	} = useUsernameValidation(username);

	useEffect(() => {
		const usernameParam = searchParams.get("username");
		if (usernameParam) {
			setUsername(usernameParam);
		}
	}, [searchParams]);

	const handleUsernameSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Check if username is valid before proceeding
		if (!isUsernameValid) {
			toast.error(usernameError || "Please enter a valid username");
			return;
		}

		// Username is valid and available, proceed to next step
		toast.success("Username is available!");
		setStep(2);
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		await authClient.signUp.email(
			{
				email,
				password,
				name,
				username,
			},
			{
				onSuccess: () => {
					router.push(`/${username}`);
					toast.success("Account created successfully! Welcome to Vault 🎉");
				},
				onError: (ctx) => {
					const errorMessage = getAuthErrorMessage(ctx.error);
					toast.error(errorMessage);

					// Suggest login if account exists
					if (shouldRedirectToLogin(ctx.error)) {
						setTimeout(() => {
							toast.info("Already have an account?", {
								action: {
									label: "Log in",
									onClick: () => router.push("/login"),
								},
							});
						}, 1000);
					}

					setIsLoading(false);
				},
			}
		);
	};

	const handleGoogleSignIn = async () => {
		setIsSocialLoading(true);

		// Set auth_intent to signup
		document.cookie = "auth_intent=signup; path=/; max-age=300";

		// If username is valid, set it in cookie so auth can use it
		if (isUsernameValid && username) {
			document.cookie = `pending_username=${username}; path=/; max-age=300`;
			toast.info("Redirecting to Google...");
		} else {
			// No valid username - user will go to onboarding after OAuth
			toast.info("Redirecting to Google...");
		}

		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: "/", // Redirect to home, which will handle onboarding
		});

		if (error) {
			const errorMessage = getAuthErrorMessage(error);
			toast.error(errorMessage);

			// Suggest login if account exists
			if (shouldRedirectToLogin(error)) {
				setTimeout(() => {
					toast.info("Already have an account?", {
						action: {
							label: "Log in",
							onClick: () => router.push("/login"),
						},
					});
				}, 1000);
			}

			setIsSocialLoading(false);
		}
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* Left Side - Visual */}
			<div className="hidden lg:flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-950 p-12 relative overflow-hidden">
				<div className="z-10 text-center max-w-lg">
					<h1 className="text-4xl font-bold mb-6">Join the Vault community.</h1>
					<p className="text-xl text-gray-600 dark:text-gray-400">
						One link to help you share everything you create, curate and sell
						from your Instagram, TikTok, Twitter, YouTube and other social media
						profiles.
					</p>
				</div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full blur-3xl opacity-50 pointer-events-none" />
			</div>

			{/* Right Side - Form */}
			<div className="flex flex-col justify-center p-8 lg:p-12 bg-white dark:bg-gray-950">
				<div className="max-w-md w-full mx-auto space-y-8">
					<div className="text-center lg:text-left">
						<Link href="/" className="inline-block mb-8">
							<div className="flex items-center gap-2">
								<div className="h-6 w-6 bg-black dark:bg-white rounded-full" />
								<span className="text-lg font-bold text-black dark:text-white">
									Vault
								</span>
							</div>
						</Link>
						<h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
							{step === 1 ? "Claim your username" : "Create your account"}
						</h2>
					</div>

					{step === 1 ? (
						<form onSubmit={handleUsernameSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
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
									<p className="text-sm text-gray-500 dark:text-gray-400">
										Checking availability...
									</p>
								)}
							</div>
							<Button
								type="submit"
								className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
								disabled={!isUsernameValid || isCheckingUsername}
							>
								{isCheckingUsername && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Next
							</Button>
						</form>
					) : (
						<div className="space-y-6">
							<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex justify-between items-center">
								<div>
									<p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
										Username
									</p>
									<p className="font-medium text-gray-900 dark:text-gray-100">
										@{username}
									</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setStep(1)}
									className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
								>
									Change
								</Button>
							</div>

							<form onSubmit={handleSignup} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="Jane Doe"
										required
										minLength={2}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="jane@example.com"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Minimum 8 characters"
										required
										minLength={8}
									/>
								</div>

								<Button
									type="submit"
									className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
									disabled={isLoading}
								>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Account
								</Button>
							</form>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t dark:border-gray-700" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-white dark:bg-gray-950 px-2 text-gray-500 dark:text-gray-400">
										Or continue with
									</span>
								</div>
							</div>

							<Button
								variant="outline"
								type="button"
								className="w-full dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
								onClick={handleGoogleSignIn}
								disabled={isLoading || isSocialLoading}
							>
								{isSocialLoading && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{!isSocialLoading && (
									<svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
								)}
								{isSocialLoading ? "Redirecting..." : "Google"}
							</Button>

							<div className="text-center text-sm text-gray-500 dark:text-gray-400">
								Already have an account?{" "}
								<Link
									href="/login"
									className="font-semibold text-black hover:underline dark:text-white"
								>
									Log in
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
