import { NextResponse } from "next/server";
import { auth } from "@vault/auth";
import { headers } from "next/headers";
import prisma from "@vault/db";
import { validateUsername } from "@/lib/validation";

export async function POST(request: Request) {
	try {
		// Get current session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized - Please log in" },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();
		const { username } = body;

		if (!username) {
			return NextResponse.json(
				{ error: "Username is required" },
				{ status: 400 }
			);
		}

		// Normalize username
		const normalizedUsername = username.toLowerCase().trim();

		// Validate username format
		const validation = validateUsername(normalizedUsername);
		if (!validation.isValid) {
			return NextResponse.json({ error: validation.error }, { status: 400 });
		}

		// Check if username is already taken
		const existingUser = await prisma.user.findUnique({
			where: { username: normalizedUsername },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Username is already taken" },
				{ status: 409 }
			);
		}

		// Update user with username
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { username: normalizedUsername },
		});

		return NextResponse.json({
			success: true,
			username: updatedUser.username,
			message: "Username updated successfully",
		});
	} catch (error) {
		console.error("Error updating username:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
