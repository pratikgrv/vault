/**
 * Centralized authentication error handling
 * Provides type-safe error codes and user-friendly messages
 */

export enum AuthErrorCode {
	INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
	ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
	ACCOUNT_EXISTS = "ACCOUNT_EXISTS",
	USERNAME_TAKEN = "USERNAME_TAKEN",
	USERNAME_REQUIRED = "USERNAME_REQUIRED",
	USERNAME_INVALID = "USERNAME_INVALID",
	WEAK_PASSWORD = "WEAK_PASSWORD",
	INVALID_EMAIL = "INVALID_EMAIL",
	SESSION_EXPIRED = "SESSION_EXPIRED",
	NETWORK_ERROR = "NETWORK_ERROR",
	UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export const AUTH_ERROR_MESSAGES: Record<AuthErrorCode, string> = {
	[AuthErrorCode.INVALID_CREDENTIALS]:
		"Invalid email or password. Please try again.",
	[AuthErrorCode.ACCOUNT_NOT_FOUND]: "No account found. Please sign up first.",
	[AuthErrorCode.ACCOUNT_EXISTS]:
		"An account with this email already exists. Please log in instead.",
	[AuthErrorCode.USERNAME_TAKEN]:
		"This username is already taken. Please choose another.",
	[AuthErrorCode.USERNAME_REQUIRED]:
		"Username is required to create an account",
	[AuthErrorCode.USERNAME_INVALID]:
		"Username can only contain letters, numbers, hyphens, and underscores",
	[AuthErrorCode.WEAK_PASSWORD]: "Password must be at least 8 characters long",
	[AuthErrorCode.INVALID_EMAIL]: "Please enter a valid email address",
	[AuthErrorCode.SESSION_EXPIRED]:
		"Your session has expired. Please try again.",
	[AuthErrorCode.NETWORK_ERROR]:
		"Network error. Please check your connection and try again.",
	[AuthErrorCode.UNKNOWN_ERROR]:
		"Something went wrong. Please try again later.",
};

/**
 * Parse error from better-auth and return appropriate error code
 */
export function parseAuthError(error: unknown): AuthErrorCode {
	if (!error) return AuthErrorCode.UNKNOWN_ERROR;

	const err = error as any;
	const message = err?.message?.toLowerCase() || "";
	const status = err?.status;

	// Network errors
	if (err?.name === "NetworkError" || message.includes("network")) {
		return AuthErrorCode.NETWORK_ERROR;
	}

	// Account not found (403 or specific messages)
	if (
		status === 403 ||
		message.includes("not found") ||
		message.includes("no user")
	) {
		return AuthErrorCode.ACCOUNT_NOT_FOUND;
	}

	// Account already exists (422 or specific messages)
	if (
		status === 422 ||
		message.includes("exists") ||
		message.includes("already registered")
	) {
		return AuthErrorCode.ACCOUNT_EXISTS;
	}

	// Invalid credentials
	if (
		message.includes("invalid") &&
		(message.includes("password") ||
			message.includes("credentials") ||
			message.includes("email"))
	) {
		return AuthErrorCode.INVALID_CREDENTIALS;
	}

	// Username issues
	if (message.includes("username")) {
		if (message.includes("taken") || message.includes("exists")) {
			return AuthErrorCode.USERNAME_TAKEN;
		}
		if (message.includes("required")) {
			return AuthErrorCode.USERNAME_REQUIRED;
		}
		if (message.includes("invalid")) {
			return AuthErrorCode.USERNAME_INVALID;
		}
	}

	// Password issues
	if (message.includes("password")) {
		if (message.includes("weak") || message.includes("short")) {
			return AuthErrorCode.WEAK_PASSWORD;
		}
	}

	// Email issues
	if (message.includes("email") && message.includes("invalid")) {
		return AuthErrorCode.INVALID_EMAIL;
	}

	// Session issues
	if (message.includes("session") || message.includes("expired")) {
		return AuthErrorCode.SESSION_EXPIRED;
	}

	return AuthErrorCode.UNKNOWN_ERROR;
}

/**
 * Get user-friendly error message from error object
 */
export function getAuthErrorMessage(error: unknown): string {
	const code = parseAuthError(error);
	return AUTH_ERROR_MESSAGES[code];
}

/**
 * Check if error indicates user should sign up instead of login
 */
export function shouldRedirectToSignup(error: unknown): boolean {
	const code = parseAuthError(error);
	return code === AuthErrorCode.ACCOUNT_NOT_FOUND;
}

/**
 * Check if error indicates user should login instead of signup
 */
export function shouldRedirectToLogin(error: unknown): boolean {
	const code = parseAuthError(error);
	return code === AuthErrorCode.ACCOUNT_EXISTS;
}
