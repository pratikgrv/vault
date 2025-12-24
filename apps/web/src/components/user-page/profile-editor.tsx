"use client";

import { useState, useTransition, useMemo } from "react";
import {
	type ProfileData,
	DEMO_PROFILE,
	ProfileDisplay,
} from "./profile-display";
import { SocialAddModal } from "./social-add-modal";
import { motion, AnimatePresence } from "motion/react";
import {
	ChartNoAxesColumn,
	User,
	Settings2,
	Globe,
	Compass,
	MessageCircle,
	Link as LinkIcon,
	Quote,
	Calculator,
	Monitor,
	Smartphone,
	Trash2,
	Plus,
	Save,
} from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";
import ToolbarExpandable, { type ToolbarItem } from "../dynamic-toolbar";
import UserRankingEdit from "../user-section/user-ranking-edit";
import UserSettings from "../user-section/user-settings";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface ProfileEditorProps {
	initialData?: ProfileData;
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
	const defaultProfile = useMemo(
		() => initialData || DEMO_PROFILE,
		[initialData]
	);

	// Initialize active categories based on existing interests
	const initialCategories = () => {
		console.log(defaultProfile, "defaultProfile");
		const categories = new Set(
			defaultProfile.interests?.map((i) => i.category) || []
		);
		if (categories.size === 0) categories.add("anime"); // Default category
		return Array.from(categories);
	};

	const [profile, setProfile] = useState<ProfileData>({
		...defaultProfile,
		activeCategories: initialCategories(),
	});

	const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop");
	const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const isDirty = useMemo(() => {
		// Simple dirty check - can be improved
		return (
			JSON.stringify(profile) !==
			JSON.stringify({
				...defaultProfile,
				activeCategories: initialCategories,
			})
		);
	}, [profile, defaultProfile, initialCategories]);

	const handleBasicChange = (field: keyof ProfileData, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const updateLink = (id: string, field: "title" | "url", value: string) => {
		setProfile((prev) => ({
			...prev,
			links: prev.links.map((link) =>
				link.id === id ? { ...link, [field]: value } : link
			),
		}));
	};

	const addLink = () => {
		const newLink = {
			id: Math.random().toString(36).substr(2, 9),
			title: "New Link",
			url: "https://",
		};
		setProfile((prev) => ({ ...prev, links: [...prev.links, newLink] }));
	};

	const handleSocialAdd = (social: {
		platform: string;
		username: string;
		url: string;
	}) => {
		const newSocial = {
			...social,
			id: Math.random().toString(36).substr(2, 9),
		};
		setProfile((prev) => ({
			...prev,
			socials: [...(prev.socials || []), newSocial],
		}));
	};

	const handleSocialDelete = (id: string) => {
		setProfile((prev) => ({
			...prev,
			socials: prev.socials?.filter((s) => s.id !== id) || [],
		}));
	};

	const handleRankingChange = (category: string, newInterests: any[]) => {
		setProfile((prev) => {
			// Remove all interests of this category
			const otherInterests = (prev.interests || []).filter(
				(i) => i.category !== category
			);

			// Map new interests to schema format
			const mappedNewInterests = newInterests.map((i) => ({
				id: i.id || Math.random().toString(36).substr(2, 9),
				title: i.title,
				imageUrl:
					i.imageUrl ||
					i.images?.webp?.large_image_url ||
					i.images?.jpg?.large_image_url,
				category: category,
				content: i.content || {
					score: i.score,
					type: i.type,
				},
			}));

			return {
				...prev,
				interests: [...otherInterests, ...mappedNewInterests],
			};
		});
	};

	const onCategoryToggle = (category: string) => {
		setProfile((prev) => {
			const current = prev.activeCategories || [];
			if (current.includes(category)) {
				return {
					...prev,
					activeCategories: current.filter((c) => c !== category),
				};
			} else {
				return { ...prev, activeCategories: [...current, category] };
			}
		});
	};

	const removeLink = (id: string) => {
		setProfile((prev) => ({
			...prev,
			links: prev.links.filter((link) => link.id !== id),
		}));
	};

	// const updateLink = (id: string, field: "title" | "url", value: string) => {
	// 	setProfile((prev) => ({
	// 		...prev,
	// 		links: prev.links.map((link) =>
	// 			link.id === id ? { ...link, [field]: value } : link
	// 		),
	// 	}));
	// };
	console.log(initialCategories(), "active category");
	const handleSave = () => {
		startTransition(async () => {
			const payload: any = {};
			let hasChanges = false;

			// Check Name/Bio changes
			if (
				profile.name !== defaultProfile.name ||
				profile.bio !== defaultProfile.bio
			) {
				payload.name = profile.name;
				payload.bio = profile.bio;
				hasChanges = true;
			}

			// Check Links changes
			if (
				JSON.stringify(profile.links) !== JSON.stringify(defaultProfile.links)
			) {
				payload.links = profile.links.map((link, index) => ({
					...link,
					type: "link" as const,
					order: index,
				}));
				hasChanges = true;
			}

			// Check Socials changes
			if (
				JSON.stringify(profile.socials) !==
				JSON.stringify(defaultProfile.socials)
			) {
				payload.socials = (profile.socials || []).map((social, index) => ({
					...social,
					order: index,
				}));
				hasChanges = true;
			}

			// Check Interests changes
			if (
				JSON.stringify(profile.interests) !==
				JSON.stringify(defaultProfile.interests)
			) {
				payload.interests = (profile.interests || []).map(
					(interest, index) => ({
						...interest,
						order: index,
					})
				);
				hasChanges = true;
			}

			if (!hasChanges) {
				toast.info("No changes to save");
				return;
			}

			const result = await updateProfile(payload);

			if (result.success) {
				toast.success("Profile updated successfully");
			} else {
				toast.error("Failed to update profile");
			}
		});
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href.replace("/edit", ""));
		toast.success("Link copied to clipboard!");
	};

	const ITEMS: ToolbarItem[] = [
		{
			id: "settings",
			type: "panel",
			label: "Settings",
			title: <Settings2 className="h-5 w-5" />,
			content: <UserSettings user={profile} />,
		},
		{
			id: "separator-1",
			type: "separator",
		},
		{
			id: "save",
			type: "custom",
			content: isDirty ? (
				<button
					onClick={handleSave}
					disabled={isPending}
					className="bg-green-400 shrink-0 text-nowrap dark:bg-green-400/80 hover:bg-green-400/90 text-white px-6 py-1.5 rounded-full text-sm font-bold transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
				>
					{isPending ? "Saving..." : "Save Now"}
				</button>
			) : (
				<button
					onClick={handleShare}
					className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
				>
					Share my Vault
				</button>
			),
		},
		{
			id: "separator-2",
			type: "separator",
		},
		// {
		// 	id: "links",
		// 	type: "panel",
		// 	label: "Links",
		// 	title: <LinkIcon className="h-5 w-5" />,
		// 	content: (
		// 		<div className="p-4 w-80 space-y-4">
		// 			<div className="flex items-center justify-between">
		// 				<h3 className="font-medium text-sm">Links</h3>
		// 				<Button
		// 					size="sm"
		// 					variant="outline"
		// 					onClick={addLink}
		// 					className="h-7 text-xs"
		// 				>
		// 					<Plus className="w-3 h-3 mr-1" /> Add
		// 				</Button>
		// 			</div>
		// 			<div className="space-y-3 max-h-60 overflow-y-auto pr-1">
		// 				{profile.links.map((link) => (
		// 					<div
		// 						key={link.id}
		// 						className="p-3 border rounded-lg space-y-2 bg-muted/50"
		// 					>
		// 						<div className="flex items-start gap-2">
		// 							<div className="space-y-2 flex-1">
		// 								<Input
		// 									placeholder="Title"
		// 									value={link.title}
		// 									onChange={(e) =>
		// 										updateLink(link.id, "title", e.target.value)
		// 									}
		// 									className="h-7 text-xs"
		// 								/>
		// 								<Input
		// 									placeholder="URL"
		// 									value={link.url}
		// 									onChange={(e) =>
		// 										updateLink(link.id, "url", e.target.value)
		// 									}
		// 									className="h-7 text-xs font-mono"
		// 								/>
		// 							</div>
		// 							<Button
		// 								variant="ghost"
		// 								size="icon"
		// 								className="h-6 w-6 text-muted-foreground hover:text-destructive"
		// 								onClick={() => removeLink(link.id)}
		// 							>
		// 								<Trash2 className="w-3 h-3" />
		// 							</Button>
		// 						</div>
		// 					</div>
		// 				))}
		// 				{profile.links.length === 0 && (
		// 					<div className="text-center p-4 border border-dashed rounded text-xs text-muted-foreground">
		// 						No links yet
		// 					</div>
		// 				)}
		// 			</div>
		// 			<Button
		// 				size="sm"
		// 				className="w-full"
		// 				onClick={handleSave}
		// 				disabled={isPending}
		// 			>
		// 				{isPending ? "Saving..." : "Save Changes"}
		// 			</Button>
		// 		</div>
		// 	),
		// },
		{
			id: "bio",
			type: "panel",
			label: "Bio",
			title: <Quote className="h-5 w-5" />,
			content: (
				<div className="p-4 w-content space-y-3">
					<h3 className="font-medium text-sm">Edit Bio</h3>
					<Textarea
						placeholder="Tell your story..."
						value={profile.bio || ""}
						onChange={(e) => handleBasicChange("bio", e.target.value)}
						className="h-24 resize-none text-sm"
					/>
					<div className="space-y-2">
						<Label className="text-xs">Display Name</Label>
						<Input
							value={profile.name}
							onChange={(e) => handleBasicChange("name", e.target.value)}
							className="h-8 text-sm"
						/>
					</div>
					<Button
						size="sm"
						className="w-full"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			),
		},
		{
			id: "interests",
			type: "panel",
			label: "Interests",
			title: <Globe className="h-5 w-5" />,
			content: (
				<UserRankingEdit
					activeCategories={profile.activeCategories || []}
					onToggleCategory={onCategoryToggle}
				/>
			),
		},
		{
			id: "separator-3",
			type: "separator",
		},
		{
			id: "view-mode",
			type: "action",
			label: "Toggle View",
			title:
				viewMode === "desktop" ? (
					<Smartphone className="h-5 w-5" />
				) : (
					<Monitor className="h-5 w-5" />
				),
			onClick: () =>
				setViewMode((prev) => (prev === "desktop" ? "mobile" : "desktop")),
		},
		{
			id: "delete",
			type: "action",
			label: "Delete",
			title: <Trash2 className="h-5 w-5" />,
			onClick: () => toast.error("Delete functionality not implemented"),
		},
	];

	return (
		<div className="flex flex-col  ">
			{/* Preview Area (Full Screen) */}
			<div className="flex-1 flex items-center justify-center  relative overflow-hidden bg-muted/30">
				{/* <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-size-[16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
				 */}

				<div
					className={`transition-all duration-500 ease-in-out relative shadow-2xl overflow-hidden ${
						viewMode === "mobile"
							? "w-full h-full md:w-[375px] md:h-[812px] md:rounded-[3rem] md:border-8 border-gray-900 dark:border-gray-700"
							: "w-full h-full rounded-none border-0"
					}`}
				>
					{viewMode === "mobile" && (
						<div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 dark:bg-gray-700 rounded-b-2xl z-20 pointer-events-none"></div>
					)}

					<div className="">
						<ProfileDisplay
							data={profile}
							preview={true}
							onRankingChange={handleRankingChange}
							onSocialAdd={() => setIsSocialModalOpen(true)}
							onSocialDelete={handleSocialDelete}
						/>
					</div>
				</div>
			</div>

			<SocialAddModal
				isOpen={isSocialModalOpen}
				onClose={() => setIsSocialModalOpen(false)}
				onSave={handleSocialAdd}
			/>

			<ToolbarExpandable items={ITEMS} />
		</div>
	);
}
