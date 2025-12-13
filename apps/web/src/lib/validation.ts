/**
 * Validation utilities for authentication forms
 */

// Username validation
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

export const RESERVED_USERNAMES = [
	"admin",
	"api",
	"auth",
	"login",
	"signup",
	"register",
	"settings",
	"profile",
	"dashboard",
	"account",
	"user",
	"users",
	"help",
	"support",
	"about",
	"terms",
	"privacy",
	"contact",
	"blog",
	"docs",
	"documentation",
	"vault",
	"vaultbio",
	"root",
	"system",
	"public",
	"static",
	"assets",
	"images",
	"css",
	"js",
	"javascript",
];

export interface UsernameValidationResult {
	isValid: boolean;
	error?: string;
}

/**
 * Validate username format (client-side)
 */
export function validateUsername(username: string): UsernameValidationResult {
	if (!username) {
		return { isValid: false, error: "Username is required" };
	}

	if (username.length < USERNAME_MIN_LENGTH) {
		return {
			isValid: false,
			error: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
		};
	}

	if (username.length > USERNAME_MAX_LENGTH) {
		return {
			isValid: false,
			error: `Username must be at most ${USERNAME_MAX_LENGTH} characters`,
		};
	}

	if (!USERNAME_REGEX.test(username)) {
		return {
			isValid: false,
			error:
				"Username can only contain letters, numbers, hyphens, and underscores",
		};
	}

	const lowerUsername = username.toLowerCase();
	if (RESERVED_USERNAMES.includes(lowerUsername)) {
		return {
			isValid: false,
			error: "This username is reserved and cannot be used",
		};
	}

	return { isValid: true };
}

// Password validation
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// Optional: stronger password requirements
export const PASSWORD_STRONG_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export interface PasswordValidationResult {
	isValid: boolean;
	error?: string;
	strength?: "weak" | "medium" | "strong";
}

/**
 * Validate password (basic requirements)
 */
export function validatePassword(password: string): PasswordValidationResult {
	if (!password) {
		return { isValid: false, error: "Password is required" };
	}

	if (password.length < PASSWORD_MIN_LENGTH) {
		return {
			isValid: false,
			error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
		};
	}

	if (password.length > PASSWORD_MAX_LENGTH) {
		return {
			isValid: false,
			error: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
		};
	}

	// Calculate strength
	let strength: "weak" | "medium" | "strong" = "weak";

	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecial = /[@$!%*?&]/.test(password);

	const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
		Boolean
	).length;

	if (password.length >= 12 && criteriaCount >= 3) {
		strength = "strong";
	} else if (password.length >= 10 && criteriaCount >= 2) {
		strength = "medium";
	}

	return { isValid: true, strength };
}

/**
 * Validate password with strong requirements (optional)
 */
export function validatePasswordStrong(
	password: string
): PasswordValidationResult {
	const basicValidation = validatePassword(password);
	if (!basicValidation.isValid) {
		return basicValidation;
	}

	if (!PASSWORD_STRONG_REGEX.test(password)) {
		return {
			isValid: false,
			error:
				"Password must include uppercase, lowercase, number, and special character",
		};
	}

	return { isValid: true, strength: "strong" };
}

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailValidationResult {
	isValid: boolean;
	error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): EmailValidationResult {
	if (!email) {
		return { isValid: false, error: "Email is required" };
	}

	if (!EMAIL_REGEX.test(email)) {
		return { isValid: false, error: "Please enter a valid email address" };
	}

	return { isValid: true };
}

// Name validation
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

export interface NameValidationResult {
	isValid: boolean;
	error?: string;
}

/**
 * Validate name
 */
export function validateName(name: string): NameValidationResult {
	if (!name) {
		return { isValid: false, error: "Name is required" };
	}

	if (name.length < NAME_MIN_LENGTH) {
		return {
			isValid: false,
			error: `Name must be at least ${NAME_MIN_LENGTH} characters`,
		};
	}

	if (name.length > NAME_MAX_LENGTH) {
		return {
			isValid: false,
			error: `Name must be at most ${NAME_MAX_LENGTH} characters`,
		};
	}

	return { isValid: true };
}
