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

	const user = await prisma.user.findUnique({
		where: { username },
		include: { profile: true },
	});

	if (!user) {
		notFound();
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const isOwner = session?.user?.id === user?.id;

	// Transform DB data to ProfileData
	const profileData: any = {
		name: user?.name,
		username: user?.username || "",
		bio: user?.profile?.bio || DEMO_PROFILE.bio,
		theme: (user?.profile?.theme as any) || DEMO_PROFILE.theme,
		links: (user?.profile?.links as any) || DEMO_PROFILE.links,
	};

	if (isOwner) {
		return <ProfileEditor initialData={profileData} />;
	}

	return <ProfileDisplay data={profileData} />;
}
