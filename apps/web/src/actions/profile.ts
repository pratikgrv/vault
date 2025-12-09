"use server";

import { auth } from "@vault/auth";
import prisma from "@vault/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type ProfileData = {
	name: string;
	bio: string;
	theme: {
		backgroundColor: string;
		primaryColor: string;
	};
	links: {
		id: string;
		title: string;
		url: string;
	}[];
};

export async function updateProfile(data: ProfileData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const user = session.user;

	try {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				name: data.name,
				profile: {
					upsert: {
						create: {
							bio: data.bio,
							theme: data.theme,
							links: data.links,
						},
						update: {
							bio: data.bio,
							theme: data.theme,
							links: data.links,
						},
					},
				},
			},
		});

		revalidatePath(`/${user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to update profile:", error);
		return { success: false, error: "Failed to update profile" };
	}
}
