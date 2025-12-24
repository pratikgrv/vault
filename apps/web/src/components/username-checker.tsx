"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utils file
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface UsernameCheckerProps {
	className?: string;
}

export function UsernameChecker({ className }: UsernameCheckerProps) {
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
		<div className={cn("w-full max-w-lg mx-auto", className)}>
			<form onSubmit={handleSubmit} className="relative group">
				<div className="relative flex items-center">
					<input
						type="text"
						placeholder="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full h-16 pl-32 pr-16 rounded-full border-2 border-border/50 bg-background/50 backdrop-blur-xl text-xl font-medium placeholder:text-muted-foreground/30 focus:outline-none focus:border-foreground/20 focus:ring-4 focus:ring-foreground/5 transition-all shadow-sm hover:border-border hover:shadow-md"
						autoComplete="off"
						spellCheck="false"
					/>

					<span className="absolute left-6 text-xl font-medium text-muted-foreground/50 select-none pointer-events-none transition-colors group-focus-within:text-foreground/50">
						vault.bio/
					</span>

					<div className="absolute right-3 pl-3 flex items-center gap-2">
						{/* Status Indicator */}
						<div className="flex items-center justify-center w-8 h-8">
							{isChecking ? (
								<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
							) : isAvailable === true ? (
								<Check className="h-5 w-5 text-green-500" />
							) : isAvailable === false ? (
								<X className="h-5 w-5 text-red-500" />
							) : null}
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							disabled={!isAvailable || isChecking}
							size="icon"
							className={cn(
								"h-10 w-10 rounded-full transition-all duration-300",
								isAvailable
									? "cursor-pointer opacity-100 translate-x-0"
									: "opacity-50 cursor-not-allowed scale-95"
							)}
						>
							<ArrowRight className="h-5 w-5" />
						</Button>
					</div>
				</div>

				{/* Helper Text */}
				<div className="absolute top-full left-0 mt-3 w-full text-center h-6 overflow-hidden">
					{isAvailable === false && (
						<p className="text-red-500 text-sm font-medium animate-in slide-in-from-top-2 fade-in">
							Sorry, that username is taken.
						</p>
					)}
					{isAvailable === true && (
						<p className="text-green-500 text-sm font-medium animate-in slide-in-from-top-2 fade-in">
							That one is yours! Claim it.
						</p>
					)}
				</div>
			</form>
		</div>
	);
}
