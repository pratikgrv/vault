import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import prisma from "@vault/db";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get("username");

	if (!username || username.length < 3) {
		return NextResponse.json(
			{ error: "Username must be at least 3 characters long" },
			{ status: 400 }
		);
	}

	try {
		const existingUser = await prisma.user.findUnique({
			where: { username },
		});

		if (existingUser) {
			return NextResponse.json({ available: false });
		}

		// Set a secure cookie with the available username
		// In a real app, you might want to sign this or use a temporary session
		const cookieStore = await cookies();
		cookieStore.set("pending_username", username, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 15, // 15 minutes
			path: "/",
		});

		return NextResponse.json({ available: true });
	} catch (error) {
		console.error("Error checking username:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
