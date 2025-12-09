"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					router.push("/"); // Or check if we can redirect to username if available? Dashboard is safe default.
					toast.success("Welcome back!");
				},
				onError: (ctx) => {
					const error = ctx.error as any;
					if (
						error.status === 403 ||
						error.message?.toLowerCase().includes("invalid") ||
						error.message?.toLowerCase().includes("not found")
					) {
						toast.error("No account found, create one");
					} else {
						toast.error(error.message);
					}
					setIsLoading(false);
				},
			}
		);
	};

	const handleGoogleSignIn = async () => {
		document.cookie = "auth_intent=login; path=/; max-age=300";
		const { error, data } = await authClient.signIn.social({
			provider: "google",
			additionalData: {
				test: "addditional data",
			},
			callbackURL: "/",
		});
		if (error) {
			const err = error as any;
			if (
				err.status === 403 ||
				err.message?.toLowerCase().includes("not found") ||
				err.message?.toLowerCase().includes("invalid")
			) {
				toast.error("No account found, create one");
			} else {
				toast.error(err.message);
			}
			setIsLoading(false);
		}
		// if(data){
		// 	toast.success("Welcome back!");
		// 	setIsLoading(false);
		// }
	};

	return (
		<div className="min-h-screen grid lg:grid-cols-2">
			{/* Left Side - Visual */}
			<div className="hidden lg:flex flex-col justify-center items-center bg-muted p-12 relative overflow-hidden">
				<div className="z-10 text-center max-w-lg">
					<h1 className="text-4xl font-bold mb-6 text-foreground">
						Welcome back.
					</h1>
					<p className="text-xl text-muted-foreground">
						Log in to manage your link, check your analytics, and update your
						profile.
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
							Log in to your account
						</h2>
					</div>

					<form onSubmit={handleSignIn} className="space-y-4">
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
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									href="/forgot-password"
									className="text-xs font-medium text-muted-foreground hover:text-foreground"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Log in
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						type="button"
						className="w-full"
						onClick={handleGoogleSignIn}
						disabled={isLoading}
					>
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
						Google
					</Button>

					<div className="text-center text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link
							href="/signup"
							className="font-semibold text-foreground hover:underline"
						>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
