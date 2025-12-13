import { auth } from "@vault/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UsernameChecker } from "@/components/username-checker";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	console.log(
		"Home Page Session Check:",
		session?.user?.email,
		session?.user?.username
	);

	// If user is logged in
	if (session) {
		// Check if user has a username
		if (!session.user.username) {
			// New user from social login without username - redirect to onboarding
			console.log("User needs onboarding - no username set");
			redirect("/onboarding");
		}

		// User has username - redirect to their profile
		redirect(`/${session.user.username}`);
	}

	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-[#F3F4F6] dark:bg-gray-950">
			{/* Header */}
			<header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:px-12">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 bg-black rounded-full" />
					<span className="text-xl font-bold tracking-tight text-black dark:text-white">
						Vault
					</span>
				</div>
				<nav className="flex items-center gap-4">
					<Link href="/login">
						<Button
							variant="ghost"
							className="text-base font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500"
						>
							Log in
						</Button>
					</Link>
					<Link href="/signup">
						<Button className="rounded-full px-6 text-base font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-gray-500">
							Sign up free
						</Button>
					</Link>
				</nav>
			</header>

			{/* Hero Content - Centered (Visual) */}
			<div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
				<h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none text-black dark:text-white">
					Everything you are.
					<br />
					<span className="text-gray-400 dark:text-gray-500">
						In one simple link.
					</span>
				</h1>
				<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
					Join 50M+ people using Vault for their link in bio. One link to help
					you share everything you create, curate and sell from your Instagram,
					TikTok, Twitter, YouTube and other social media profiles.
				</p>
			</div>

			{/* Bottom Left Checker */}
			<UsernameChecker />

			{/* Decorative Background Elements */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
		</main>
	);
}
