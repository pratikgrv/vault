import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import type { ProfileData } from "../user-page/profile-display";

interface UserProfileEditProps {
	profile: ProfileData;
	handleBasicChange: (field: keyof ProfileData, value: string) => void;
	handleThemeChange: (
		field: keyof NonNullable<ProfileData["theme"]>,
		value: string
	) => void;
	updateLink: (id: string, field: "title" | "url", value: string) => void;
	addLink: () => void;
	removeLink: (id: string) => void;
	handleSave: () => void;
	isPending: boolean;
}

const UserProfileEdit = ({
	profile,
	handleBasicChange,
	handleThemeChange,
	updateLink,
	addLink,
	removeLink,
	handleSave,
	isPending,
}: UserProfileEditProps) => {
	return (
		<div className="space-y-8 w-full max-w-md mx-auto pb-4">
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
				<h3 className="font-semibold text-gray-900 dark:text-gray-100">
					Theme
				</h3>
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
					<h3 className="font-semibold text-gray-900 dark:text-gray-100">
						Links
					</h3>
					<Button
						size="sm"
						variant="outline"
						onClick={addLink}
						className="dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
					>
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
										onChange={(e) => updateLink(link.id, "url", e.target.value)}
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
							<Button
								variant="link"
								onClick={addLink}
								className="dark:text-blue-400 dark:hover:text-blue-300"
							>
								Add your first link
							</Button>
						</div>
					)}
				</div>
			</section>

			<div className="pt-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 sticky bottom-0">
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
	);
};

export default UserProfileEdit;
