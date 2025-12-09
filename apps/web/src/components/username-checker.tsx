"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export function UsernameChecker() {
	const [username, setUsername] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const debouncedUsername = useDebounce(username, 500);
	const router = useRouter();

	useEffect(() => {
		async function checkUsername() {
			if (!debouncedUsername || debouncedUsername.length < 3) {
				setIsAvailable(null);
				return;
			}

			setIsChecking(true);
			try {
				const res = await fetch(
					`/api/username/check?username=${encodeURIComponent(
						debouncedUsername
					)}`
				);
				const data = await res.json();
				setIsAvailable(data.available);
			} catch (error) {
				console.error("Error checking username:", error);
				setIsAvailable(null);
			} finally {
				setIsChecking(false);
			}
		}

		checkUsername();
	}, [debouncedUsername]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isAvailable) {
			router.push(`/signup?username=${encodeURIComponent(username)}`);
		}
	};

	return (
		<div className="fixed bottom-0 left-0 p-6 z-10 w-full max-w-md md:m-8">
			<div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
				<h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">
					Claim your Vault
				</h2>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Get your unique link before it's gone.
				</p>

				<form onSubmit={handleSubmit} className="flex gap-2 relative">
					<div className="relative w-full">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium">
							vault.bio/
						</span>
						<Input
							type="text"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className={`pl-24 pr-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 transition-all ${
								isAvailable === true
									? "border-green-500 focus:border-green-500 ring-green-500/20"
									: isAvailable === false
									? "border-red-500 focus:border-red-500 ring-red-500/20"
									: ""
							}`}
						/>
						<div className="absolute right-3 top-1/2 -translate-y-1/2">
							{isChecking ? (
								<Loader2 className="h-5 w-5 animate-spin text-gray-400 dark:text-gray-500" />
							) : isAvailable === true ? (
								<Check className="h-5 w-5 text-green-500" />
							) : isAvailable === false ? (
								<X className="h-5 w-5 text-red-500" />
							) : null}
						</div>
					</div>
					<Button
						type="submit"
						disabled={!isAvailable || isChecking}
						size="icon"
						className="h-12 w-12 shrink-0 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-lg transition-all"
					>
						<ArrowRight className="h-5 w-5" />
					</Button>
				</form>
				{isAvailable === false && (
					<p className="text-red-500 text-xs mt-2 pl-1 animate-in slide-in-from-top-1">
						Sorry, that username is already taken.
					</p>
				)}
			</div>
		</div>
	);
}
