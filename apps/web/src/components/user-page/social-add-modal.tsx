"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Youtube,
	Instagram,
	Twitter,
	Github,
	Globe,
	Linkedin,
} from "lucide-react";

const PLATFORMS = [
	{ id: "youtube", label: "YouTube", icon: Youtube },
	{ id: "instagram", label: "Instagram", icon: Instagram },
	{ id: "twitter", label: "Twitter", icon: Twitter },
	{ id: "github", label: "GitHub", icon: Github },
	{ id: "linkedin", label: "LinkedIn", icon: Linkedin },
	{ id: "other", label: "Other", icon: Globe },
];

interface SocialAddModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (social: { platform: string; username: string; url: string }) => void;
}

export function SocialAddModal({
	isOpen,
	onClose,
	onSave,
}: SocialAddModalProps) {
	const [platform, setPlatform] = useState("youtube");
	const [username, setUsername] = useState("");
	const [url, setUrl] = useState("");

	const handleSave = () => {
		onSave({ platform, username, url });
		setPlatform("youtube");
		setUsername("");
		setUrl("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle>Add Social Media</DialogTitle>
				</DialogHeader>
				<div className="grid gap-6 py-4">
					<div className="grid gap-3">
						<Label>Platform</Label>
						<div className="grid grid-cols-3 gap-2">
							{PLATFORMS.map((p) => {
								const Icon = p.icon;
								return (
									<button
										key={p.id}
										type="button"
										onClick={() => setPlatform(p.id)}
										className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
											platform === p.id
												? "border-primary bg-primary/10 text-primary"
												: "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
										}`}
									>
										<Icon className="size-5" />
										<span className="text-[10px] font-medium uppercase tracking-wider">
											{p.label}
										</span>
									</button>
								);
							})}
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="username">Username / Handle</Label>
						<Input
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="@username"
							className="bg-zinc-900 border-zinc-800 focus:ring-primary"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="url">Profile URL</Label>
						<Input
							id="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://..."
							className="bg-zinc-900 border-zinc-800 focus:ring-primary"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="ghost"
						onClick={onClose}
						className="hover:bg-zinc-900"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						className="bg-primary hover:bg-primary/90"
					>
						Add Social
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
