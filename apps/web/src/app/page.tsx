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

	if (session) {
		if (!session.user.username) {
			redirect("/onboarding");
		}
		redirect(`/${session.user.username}`);
	}

	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black selection:bg-purple-500/30">
			{/* Gradient Backgrounds */}
			<div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50 pointer-events-none" />
			<div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />
			<div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:px-12 backdrop-blur-sm bg-white/50 dark:bg-black/50 border-b border-black/5 dark:border-white/5 transition-all">
				<div className="flex items-center gap-2">
					<div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
						<span className="text-white dark:text-black font-bold text-xs">
							V
						</span>
					</div>
					<span className="text-lg font-bold tracking-tight text-black dark:text-white">
						Vault
					</span>
				</div>
				<nav className="flex items-center gap-3">
					<Link href="/login">
						<Button
							variant="ghost"
							className="text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
						>
							Log in
						</Button>
					</Link>
					<Link href="/signup">
						<Button className="rounded-full px-5 text-sm font-medium bg-black hover:bg-black/80 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20">
							Sign up
						</Button>
					</Link>
				</nav>
			</header>

			{/* Hero Content */}
			<div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
				<div className="animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out fill-mode-backwards">
					<div className="mb-6 inline-flex items-center rounded-full border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-1 text-sm text-muted-foreground backdrop-blur-xl">
						<span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
						New: Social Integrations
					</div>
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-black dark:text-white max-w-5xl mx-auto">
						Everything you are. <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
							In one simple link.
						</span>
					</h1>
					<p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
						Share your interests like anime, movies, games, and more from a
						single, beautiful profile.
					</p>
				</div>

				<div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150 fill-mode-backwards">
					<UsernameChecker />
					<p className="mt-12 text-xs text-gray-400 uppercase tracking-widest font-medium">
						Free forever. No credit card required.
					</p>
				</div>

				{/* Floating Elements (Optional Visuals) */}
				<div className="absolute top-1/3 left-[5%] hidden lg:block animate-in fade-in zoom-in duration-1000 delay-500">
					<div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-black/5 dark:border-white/10 shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
								📸
							</div>
							<div>
								<div className="h-2 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
								<div className="h-2 w-12 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
							</div>
						</div>
					</div>
				</div>

				<div className="absolute bottom-1/4 right-[5%] hidden lg:block animate-in fade-in zoom-in duration-1000 delay-700">
					<div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-black/5 dark:border-white/10 shadow-2xl rotate-[6deg] hover:rotate-0 transition-transform duration-500">
						<div className="flex items-center gap-3">
							<div>
								<div className="h-2 w-20 bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
								<div className="h-2 w-16 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
							</div>
							<div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
								🎵
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
