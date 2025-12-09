import {
	type LucideIcon,
	Github,
	Linkedin,
	Twitter,
	Globe,
	Link as LinkIcon,
	Mail,
} from "lucide-react";
import Link from "next/link";

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
};

interface ProfileDisplayProps {
	data: ProfileData;
	preview?: boolean;
}

const iconMap: Record<string, any> = {
	Github,
	Linkedin,
	Twitter,
	Globe,
	Mail,
	Link: LinkIcon,
};

export function ProfileDisplay({ data, preview = false }: ProfileDisplayProps) {
	const { name, username, bio, links, theme } = data;

	return (
		<div
			className={`min-h-screen p-8 flex flex-col items-center justify-center ${
				preview ? "rounded-xl border shadow-sm" : ""
			}`}
			style={{ backgroundColor: theme?.backgroundColor || "#f9fafb" }}
		>
			<div className="max-w-md w-full space-y-8 text-center">
				{/* Header */}
				<div>
					<div
						className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold mb-4"
						style={{
							backgroundColor: theme?.primaryColor || "#000",
							color: "#fff",
						}}
					>
						{name?.[0]?.toUpperCase() || "?"}
					</div>
					<h1
						className="text-2xl font-bold"
						style={{ color: theme?.textColor || "#111" }}
					>
						{name}
					</h1>
					<p className="text-gray-500 mt-1">@{username}</p>
					{bio && (
						<p
							className="mt-4 text-sm"
							style={{ color: theme?.textColor || "#444" }}
						>
							{bio}
						</p>
					)}
				</div>

				{/* Links */}
				<div className="space-y-4 w-full">
					{links.map((link) => {
						const IconComponent = link.icon ? iconMap[link.icon] : LinkIcon;
						return (
							<a
								key={link.id}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full p-4 rounded-lg bg-white border border-gray-200 hover:scale-[1.02] transition-transform shadow-sm flex items-center justify-between group"
							>
								<div className="flex items-center gap-3">
									{IconComponent && (
										<IconComponent className="w-5 h-5 text-gray-600" />
									)}
									<span className="font-medium text-gray-900">
										{link.title}
									</span>
								</div>
							</a>
						);
					})}
					{links.length === 0 && (
						<div className="text-gray-400 italic text-sm">
							No links added yet
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
