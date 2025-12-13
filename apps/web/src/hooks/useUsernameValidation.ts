import { useState, useEffect, useCallback } from "react";
import { validateUsername } from "@/lib/validation";

export type UsernameStatus =
	| "idle"
	| "checking"
	| "available"
	| "taken"
	| "invalid";

export interface UseUsernameValidationResult {
	status: UsernameStatus;
	error: string | null;
	isValid: boolean;
	isChecking: boolean;
}

/**
 * Hook for real-time username validation with debouncing
 * @param username - The username to validate
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 */
export function useUsernameValidation(
	username: string,
	debounceMs = 500
): UseUsernameValidationResult {
	const [status, setStatus] = useState<UsernameStatus>("idle");
	const [error, setError] = useState<string | null>(null);

	const checkUsername = useCallback(async (value: string) => {
		// Client-side validation first
		const validation = validateUsername(value);
		if (!validation.isValid) {
			setStatus("invalid");
			setError(validation.error || "Invalid username");
			return;
		}

		// Check availability with API
		setStatus("checking");
		setError(null);

		try {
			const res = await fetch(
				`/api/username/check?username=${encodeURIComponent(value)}`
			);
			const data = await res.json();

			if (data.available) {
				setStatus("available");
				setError(null);
			} else {
				setStatus("taken");
				setError(data.error || "Username is already taken");
			}
		} catch (err) {
			setStatus("invalid");
			setError("Failed to check username availability");
		}
	}, []);

	useEffect(() => {
		// Reset if username is empty
		if (!username || username.length === 0) {
			setStatus("idle");
			setError(null);
			return;
		}

		// Don't check if too short
		if (username.length < 3) {
			setStatus("invalid");
			setError("Username must be at least 3 characters");
			return;
		}

		// Debounce the API call
		const timer = setTimeout(() => {
			checkUsername(username);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [username, debounceMs, checkUsername]);

	return {
		status,
		error,
		isValid: status === "available",
		isChecking: status === "checking",
	};
}
