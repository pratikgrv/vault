import {
	type LucideIcon,
	Github,
	Linkedin,
	Twitter,
	Globe,
	Link as LinkIcon,
	Mail,
	Plus,
} from "lucide-react";
import Link from "next/link";
import { AddRanking } from "./add-ranking";

export interface ProfileData {
	name: string;
	username: string;
	bio: string;
	links: {
		id: string;
		title: string;
		url: string;
		icon?: string;
	}[];
	socials?: {
		id: string;
		platform: string;
		username: string;
		url: string;
	}[];
	interests?: {
		id: string;
		title: string;
		imageUrl: string;
		category: string;
		content: any;
	}[];
	image?: string;
	activeCategories?: string[];
	theme?: {
		primaryColor: string;
		backgroundColor: string;
		textColor: string;
	};
}

export const DEMO_PROFILE: ProfileData = {
	name: "Demo User",
	username: "demouser",
	bio: "Creative Developer | Open Source Enthusiast | Tech Blogger",
	links: [
		{ id: "1", title: "My Portfolio", url: "https://example.com" },
		{ id: "2", title: "GitHub", url: "https://github.com", icon: "Github" },
		{
			id: "3",
			title: "LinkedIn",
			url: "https://linkedin.com",
			icon: "Linkedin",
		},
		{
			id: "4",
			title: "Twitter / X",
			url: "https://twitter.com",
			icon: "Twitter",
		},
	],
	theme: {
		primaryColor: "#000000",
		backgroundColor: "#ffffff",
		textColor: "#000000",
	},
	activeCategories: ["anime"],
};

interface ProfileDisplayProps {
	data: ProfileData;
	preview?: boolean;
	onRankingChange?: (category: string, interests: any[]) => void;
	onSocialAdd?: () => void;
	onSocialDelete?: (id: string) => void;
	onSocialEdit?: (id: string) => void;
}

const iconMap: Record<string, any> = {
	Github,
	Linkedin,
	Twitter,
	Globe,
	Mail,
	Link: LinkIcon,
	Youtube,
	Instagram,
};

import { Youtube, Instagram, Trash, Edit2 } from "lucide-react";

interface SocialLinksRowProps {
	socials: ProfileData["socials"];
	editable?: boolean;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	onAdd?: () => void;
}

export function SocialLinksRow({
	socials = [],
	editable = false,
	onEdit,
	onDelete,
	onAdd,
}: SocialLinksRowProps) {
	return (
		<div className="flex gap-2 items-center">
			<div className="flex gap-2 items-center">
				{socials.map((social) => {
					const Icon =
						iconMap[
							social.platform.charAt(0).toUpperCase() + social.platform.slice(1)
						] || Globe;
					return (
						<div key={social.id} className="relative group/social">
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-center size-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
							>
								<Icon className="size-5 text-white" />
							</a>
							{editable && (
								<div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/social:opacity-100 transition-opacity z-10">
									<button
										onClick={(e) => {
											e.preventDefault();
											onDelete?.(social.id);
										}}
										className="p-1 bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600"
									>
										<Trash className="size-3" />
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>
			<button
				onClick={onAdd}
				className="flex items-center justify-center size-11 bg-zinc-800/50 border border-dashed border-zinc-600 rounded-lg hover:bg-zinc-700/50 hover:border-zinc-500 transition-all group/add"
			>
				<Plus className="size-5 text-zinc-400 group-hover/add:text-zinc-200" />
			</button>
		</div>
	);
}

export function ProfileDisplay({
	data,
	preview = false,
	onRankingChange,
	onSocialAdd,
	onSocialDelete,
	onSocialEdit,
}: ProfileDisplayProps) {
	const { name, username, bio, links, socials, interests, theme } = data;

	// Group interests by category
	const groupedInterests = (interests || []).reduce((acc, interest) => {
		if (!acc[interest.category]) {
			acc[interest.category] = [];
		}
		acc[interest.category].push(interest);
		return acc;
	}, {} as Record<string, NonNullable<ProfileData["interests"]>>);

	// Ensure active categories are present even if empty
	if (data.activeCategories) {
		data.activeCategories.forEach((category) => {
			if (!groupedInterests[category]) {
				groupedInterests[category] = [];
			}
		});
	}

	return (
		<div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 transition-colors duration-500 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
			<div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 lg:gap-16">
				{/* Left Section: User Info & Socials */}
				<div className="lg:w-1/3 flex flex-col space-y-8 lg:sticky lg:top-12 h-fit">
					<div className="space-y-6">
						{/* Avatar */}
						<div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-zinc-700 overflow-hidden relative group/avatar bg-gradient-to-br from-blue-500 to-purple-600">
							{data.image ? (
								<img
									src={data.image}
									alt={name}
									className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
								/>
							) : (
								name?.[0]?.toUpperCase() || "?"
							)}
							<div className="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
						</div>

						{/* Identity */}
						<div>
							<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
								{name}
							</h1>
							<p className="text-zinc-400 font-medium text-lg mt-1">
								@{username}
							</p>
						</div>

						{/* Bio */}
						{bio && (
							<p className="text-zinc-300 text-base leading-relaxed max-w-md">
								{bio}
							</p>
						)}

						{/* Social Icons Row */}
						<SocialLinksRow
							socials={socials}
							editable={preview}
							onAdd={onSocialAdd}
							onEdit={onSocialEdit}
							onDelete={onSocialDelete}
						/>
					</div>
				</div>

				{/* Right Section: Interests */}
				<div className="lg:w-2/3 overflow-y-auto max-h-[40rem] overflow-hidden space-y-8">
					{Object.keys(groupedInterests).length === 0 ? (
						<div className="py-12 text-center border-2 border-dashed border-zinc-700 rounded-3xl">
							<p className="text-zinc-500">No interests added yet.</p>
						</div>
					) : (
						<>
							{Object.entries(groupedInterests).map(([category, items]) => (
								<div
									key={category}
									className="bg-zinc-800/30 rounded-[3rem] p-6 md:p-10 border border-zinc-700 backdrop-blur-sm min-h-[400px]"
								>
									<AddRanking
										category={category}
										editable={preview}
										initialRanking={items}
										onRankingChange={(newRanking) =>
											onRankingChange?.(category, newRanking)
										}
									/>
								</div>
							))}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
