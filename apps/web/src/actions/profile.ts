"use server";

import { auth } from "@vault/auth";
import prisma from "@vault/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ============================================
// TYPE DEFINITIONS
// ============================================

export type LinkData = {
	id?: string;
	title: string;
	url: string;
	type: "social" | "link";
	platform?: string;
	icon?: string;
	order?: number;
};

export type InterestData = {
	id?: string;
	title: string;
	imageUrl: string;
	category: string;
	content?: Record<string, any>;
	order?: number;
};

export type ProfileUpdateData = {
	name?: string;
	bio?: string;
	links?: LinkData[];
	socials?: Array<{
		id?: string;
		platform: string;
		username: string;
		url: string;
	}>;
	interests?: InterestData[];
};

// ============================================
// PROFILE UPDATE
// ============================================

export async function updateProfile(data: ProfileUpdateData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	const user = session.user;

	try {
		// Update user name if provided
		if (data.name) {
			await prisma.user.update({
				where: { id: user.id },
				data: { name: data.name },
			});
		}

		// Get or create profile
		let profile = await prisma.profile.findUnique({
			where: { userId: user.id },
		});

		if (!profile) {
			profile = await prisma.profile.create({
				data: {
					userId: user.id,
					bio: data.bio || "",
				},
			});
		} else if (data.bio !== undefined) {
			await prisma.profile.update({
				where: { id: profile.id },
				data: { bio: data.bio },
			});
		}

		// Update links if provided
		if (data.links) {
			// Delete existing regular links
			await prisma.link.deleteMany({
				where: {
					profileId: profile.id,
					type: "link",
				},
			});

			// Create new links
			if (data.links.length > 0) {
				await prisma.link.createMany({
					data: data.links.map((link, index) => ({
						profileId: profile.id,
						title: link.title,
						url: link.url,
						type: "link",
						icon: link.icon,
						order: link.order ?? index,
					})),
				});
			}
		}

		// Update socials if provided
		if (data.socials) {
			// Delete existing social links
			await prisma.link.deleteMany({
				where: {
					profileId: profile.id,
					type: "social",
				},
			});

			// Create new social links
			if (data.socials.length > 0) {
				await prisma.link.createMany({
					data: data.socials.map((social, index) => ({
						profileId: profile.id,
						title: social.username,
						url: social.url,
						type: "social",
						platform: social.platform,
						//order: social.order ?? index,
					})),
				});
			}
		}

		// Update interests if provided
		if (data.interests) {
			// Delete existing interests
			await prisma.interest.deleteMany({
				where: { profileId: profile.id },
			});

			// Create new interests
			if (data.interests.length > 0) {
				await prisma.interest.createMany({
					data: data.interests.map((interest, index) => ({
						profileId: profile.id,
						title: interest.title,
						imageUrl: interest.imageUrl,
						category: interest.category,
						content: interest.content || {},
						// order: interest.order ?? index,
					})),
				});
			}
		}

		revalidatePath(`/${user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to update profile:", error);
		return { success: false, error: "Failed to update profile" };
	}
}

// ============================================
// INDIVIDUAL LINK OPERATIONS
// ============================================

export async function addLink(data: LinkData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	try {
		const profile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
		});

		if (!profile) {
			throw new Error("Profile not found");
		}

		await prisma.link.create({
			data: {
				profileId: profile.id,
				title: data.title,
				url: data.url,
				type: data.type,
				platform: data.platform,
				icon: data.icon,
				order: data.order ?? 0,
			},
		});

		revalidatePath(`/${session.user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to add link:", error);
		return { success: false, error: "Failed to add link" };
	}
}

export async function updateLink(id: string, data: Partial<LinkData>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	try {
		await prisma.link.update({
			where: { id },
			data: {
				title: data.title,
				url: data.url,
				icon: data.icon,
				order: data.order,
			},
		});

		revalidatePath(`/${session.user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to update link:", error);
		return { success: false, error: "Failed to update link" };
	}
}

export async function deleteLink(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	try {
		await prisma.link.delete({
			where: { id },
		});

		revalidatePath(`/${session.user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to delete link:", error);
		return { success: false, error: "Failed to delete link" };
	}
}

// ============================================
// INDIVIDUAL INTEREST OPERATIONS
// ============================================

export async function addInterest(data: InterestData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	try {
		const profile = await prisma.profile.findUnique({
			where: { userId: session.user.id },
		});

		if (!profile) {
			throw new Error("Profile not found");
		}

		await prisma.interest.create({
			data: {
				profileId: profile.id,
				title: data.title,
				imageUrl: data.imageUrl,
				category: data.category,
				content: data.content || {},
				//order: data.order ?? 0,
			},
		});

		revalidatePath(`/${session.user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to add interest:", error);
		return { success: false, error: "Failed to add interest" };
	}
}

export async function updateInterest(id: string, data: Partial<InterestData>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	try {
		await prisma.interest.update({
			where: { id },
			data: {
				title: data.title,
				imageUrl: data.imageUrl,
				category: data.category,
				content: data.content,
				//order: data.order,
			},
		});

		revalidatePath(`/${session.user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to update interest:", error);
		return { success: false, error: "Failed to update interest" };
	}
}

export async function deleteInterest(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		throw new Error("Unauthorized");
	}

	try {
		await prisma.interest.delete({
			where: { id },
		});

		revalidatePath(`/${session.user.username}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to delete interest:", error);
		return { success: false, error: "Failed to delete interest" };
	}
}
