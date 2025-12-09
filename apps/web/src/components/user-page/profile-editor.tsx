"use client";

import { useState, useTransition } from "react";
import {
	type ProfileData,
	DEMO_PROFILE,
	ProfileDisplay,
} from "./profile-display";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2, Smartphone, Monitor, Loader2, Save } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";

interface ProfileEditorProps {
	initialData?: ProfileData;
}

export function ProfileEditor({ initialData }: ProfileEditorProps) {
	const [profile, setProfile] = useState<ProfileData>(
		initialData || DEMO_PROFILE
	);
	const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
	const [isPending, startTransition] = useTransition();

	const handleBasicChange = (field: keyof ProfileData, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const handleThemeChange = (
		field: keyof NonNullable<ProfileData["theme"]>,
		value: string
	) => {
		setProfile((prev) => ({
			...prev,
			theme: { ...prev.theme!, [field]: value },
		}));
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

	const removeLink = (id: string) => {
		setProfile((prev) => ({
			...prev,
			links: prev.links.filter((link) => link.id !== id),
		}));
	};

	const handleSave = () => {
		startTransition(async () => {
			const result = await updateProfile({
				name: profile.name,
				bio: profile.bio,
				theme: {
					backgroundColor: profile.theme?.backgroundColor || "#f9fafb",
					primaryColor: profile.theme?.primaryColor || "#000000",
				},
				links: profile.links,
			});

			if (result.success) {
				toast.success("Profile updated successfully");
			} else {
				toast.error("Failed to update profile");
			}
		});
	};

	return (
		<div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden font-sans">
			{/* Editor Panel */}
			<div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full z-10 shadow-lg">
				<div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
					<div>
						<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h2>
						<p className="text-sm text-gray-500 dark:text-gray-400">Customize your public page</p>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => setViewMode("mobile")}
							className={viewMode === "mobile" ? "bg-gray-100 dark:bg-gray-700" : "dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"}
							title="Mobile View"
						>
							<Smartphone className="w-4 h-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => setViewMode("desktop")}
							className={viewMode === "desktop" ? "bg-gray-100 dark:bg-gray-700" : "dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"}
							title="Desktop View"
						>
							<Monitor className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
					{/* Profile Info */}
					<section className="space-y-4">
						<h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
							Profile Information
						</h3>
						<div className="space-y-2">
							<Label className="dark:text-gray-300">Display Name</Label>
							<Input
								value={profile.name}
								onChange={(e) => handleBasicChange("name", e.target.value)}
								placeholder="What should we call you?"
								className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
							/>
						</div>
						<div className="space-y-2">
							<Label className="dark:text-gray-300">Bio</Label>
							<Textarea
								value={profile.bio}
								onChange={(e) => handleBasicChange("bio", e.target.value)}
								className="h-24 resize-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
								placeholder="Tell the world about yourself..."
							/>
						</div>
					</section>

					<hr className="border-gray-100 dark:border-gray-700" />

					{/* Theme */}
					<section className="space-y-4">
						<h3 className="font-semibold text-gray-900 dark:text-gray-100">Theme</h3>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label className="dark:text-gray-300">Background</Label>
								<div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
									<input
										type="color"
										value={profile.theme?.backgroundColor}
										onChange={(e) =>
											handleThemeChange("backgroundColor", e.target.value)
										}
										className="h-8 w-8 rounded overflow-hidden cursor-pointer border-none bg-transparent"
									/>
									<span className="text-xs font-mono text-gray-500 dark:text-gray-300 uppercase">
										{profile.theme?.backgroundColor}
									</span>
								</div>
							</div>
							<div className="space-y-2">
								<Label className="dark:text-gray-300">Buttons & Accents</Label>
								<div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
									<input
										type="color"
										value={profile.theme?.primaryColor}
										onChange={(e) =>
											handleThemeChange("primaryColor", e.target.value)
										}
										className="h-8 w-8 rounded overflow-hidden cursor-pointer border-none bg-transparent"
									/>
									<span className="text-xs font-mono text-gray-500 dark:text-gray-300 uppercase">
										{profile.theme?.primaryColor}
									</span>
								</div>
							</div>
						</div>
					</section>

					<hr className="border-gray-100 dark:border-gray-700" />

					{/* Links */}
					<section className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 dark:text-gray-100">Links</h3>
							<Button size="sm" variant="outline" onClick={addLink} className="dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700">
								<Plus className="w-4 h-4 mr-1" /> Add
							</Button>
						</div>

						<div className="space-y-4">
							{profile.links.map((link) => (
								<div
									key={link.id}
									className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 group hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="space-y-3 flex-1">
											<Input
												placeholder="Link Title (e.g., Portfolio)"
												value={link.title}
												onChange={(e) =>
													updateLink(link.id, "title", e.target.value)
												}
												className="bg-white dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 dark:placeholder-gray-300"
											/>
											<Input
												placeholder="URL (https://...)"
												value={link.url}
												onChange={(e) =>
													updateLink(link.id, "url", e.target.value)
												}
												className="bg-white text-sm font-mono text-gray-600 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 dark:placeholder-gray-300"
											/>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900 -mt-1 -mr-1"
											onClick={() => removeLink(link.id)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							))}
							{profile.links.length === 0 && (
								<div className="text-center p-8 border-2 border-dashed rounded-lg text-gray-400 dark:text-gray-500 dark:border-gray-600">
									<p>No links added yet.</p>
									<Button variant="link" onClick={addLink} className="dark:text-blue-400 dark:hover:text-blue-300">
										Add your first link
									</Button>
								</div>
							)}
						</div>
					</section>
				</div>

				<div className="p-6 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
					<Button
						className="w-full"
						size="lg"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Preview Panel */}
			<div className="hidden lg:flex flex-1 bg-gray-100 dark:bg-gray-900 items-center justify-center p-8 relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-size-[16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

				<div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
					<div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm text-sm font-medium text-gray-500 dark:text-gray-300 flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
						Live Preview
					</div>
				</div>

				<div
					className={`transition-all duration-500 ease-in-out relative bg-white dark:bg-gray-800 shadow-2xl overflow-hidden ${
						viewMode === "mobile"
							? "w-[375px] h-[812px] rounded-[3rem] border-8 border-gray-900 dark:border-gray-700"
							: "w-full max-w-4xl h-[90%] rounded-xl border border-gray-200 dark:border-gray-700"
					}`}
				>
					{/* Notch (Mobile only) */}
					{viewMode === "mobile" && (
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 dark:bg-gray-700 rounded-b-2xl z-20 pointer-events-none"></div>
					)}

					<div className="h-full w-full overflow-y-auto no-scrollbar">
						<ProfileDisplay data={profile} preview={true} />
					</div>
				</div>
			</div>
		</div>
	);
}
