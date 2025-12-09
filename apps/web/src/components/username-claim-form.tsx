"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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

export function UsernameClaimForm() {
	const [username, setUsername] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const debouncedUsername = useDebounce(username, 500);
	const router = useRouter();

	useEffect(() => {
		async function checkUsername() {
			if (debouncedUsername.length < 3) {
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
			router.push("/login");
		}
	};

	return (
		<div className="w-full max-w-md space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Enter username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
							isAvailable === true
								? "border-green-500 focus:border-green-500"
								: isAvailable === false
								? "border-red-500 focus:border-red-500"
								: "border-gray-300 focus:border-purple-500"
						}`}
					/>
					{isChecking && (
						<div className="absolute right-3 top-3">
							<Loader2 className="h-6 w-6 animate-spin text-gray-400" />
						</div>
					)}
				</div>

				{isAvailable === false && (
					<p className="text-red-500 text-sm">Username is already taken</p>
				)}
				{isAvailable === true && (
					<p className="text-green-500 text-sm">Username is available!</p>
				)}

				<button
					type="submit"
					disabled={!isAvailable || isChecking}
					className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Claim Username
				</button>
			</form>
			<p className="text-xs text-gray-500 text-center">
				✓ Available usernames are 3-20 characters
			</p>
		</div>
	);
}
