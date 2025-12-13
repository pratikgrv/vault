import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import prisma from "@vault/db";
import {
	validateUsername,
	RESERVED_USERNAMES,
	USERNAME_REGEX,
} from "@/lib/validation";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const rawUsername = searchParams.get("username");

	if (!rawUsername) {
		return NextResponse.json(
			{ error: "Username is required", available: false },
			{ status: 400 }
		);
	}

	// Normalize username (lowercase, trim)
	const username = rawUsername.toLowerCase().trim();

	// Validate username format
	const validation = validateUsername(username);
	if (!validation.isValid) {
		return NextResponse.json(
			{ error: validation.error, available: false },
			{ status: 400 }
		);
	}

	try {
		// Check if username is already taken in database
		const existingUser = await prisma.user.findUnique({
			where: { username },
		});

		if (existingUser) {
			return NextResponse.json({
				available: false,
				error: "This username is already taken",
			});
		}

		// Username is available - set secure cookie
		const cookieStore = await cookies();
		cookieStore.set("pending_username", username, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 15, // 15 minutes
			path: "/",
		});

		return NextResponse.json({
			available: true,
			message: "Username is available!",
		});
	} catch (error) {
		console.error("Error checking username:", error);
		return NextResponse.json(
			{ error: "Internal server error", available: false },
			{ status: 500 }
		);
	}
}
