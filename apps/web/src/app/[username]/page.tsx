import { auth } from "@vault/auth";
import prisma from "@vault/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProfileEditor } from "@/components/user-page/profile-editor";
import {
	ProfileDisplay,
	DEMO_PROFILE,
} from "@/components/user-page/profile-display";

export default async function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;

	// Fetch user with profile, links, and interests
	const user = await prisma.user.findUnique({
		where: { username },
		include: {
			profile: {
				include: {
					links: {
						orderBy: { order: "asc" },
					},
					interests: {
						orderBy: { createdAt: "asc" },
					},
				},
			},
		},
	});

	if (!user) {
		notFound();
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isOwner = session?.user?.id === user?.id;

	// Separate links into social and regular links
	const allLinks = user.profile?.links || [];
	const socialLinks = allLinks
		.filter((link) => link.type === "social")
		.map((link) => ({
			id: link.id,
			platform: link.platform || "",
			username: link.title,
			url: link.url,
		}));

	const regularLinks = allLinks
		.filter((link) => link.type === "link")
		.map((link) => ({
			id: link.id,
			title: link.title,
			url: link.url,
			icon: link.icon || undefined,
		}));

	// Map interests to the expected format
	const interests = (user.profile?.interests || []).map((interest) => ({
		id: interest.id,
		title: interest.title,
		imageUrl: interest.imageUrl,
		category: interest.category,
		content: interest.content || {},
	}));

	const initialUserData = {
		name: user.name,
		username: user.username || "",
		image: user.image || undefined,
		bio: user.profile?.bio || "",
		links: regularLinks.length > 0 ? regularLinks : DEMO_PROFILE.links,
		socials: socialLinks,
		interests: interests,
		activeCategories: user.profile?.interests
			?.map((i) => i.category)
			.filter((v, i, a) => a.indexOf(v) === i),
	};

	if (isOwner) {
		return <ProfileEditor initialData={initialUserData} />;
	}

	return <ProfileDisplay data={initialUserData} />;
}
