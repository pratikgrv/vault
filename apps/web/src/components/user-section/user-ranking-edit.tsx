import React from "react";
import { Film, Gamepad2, Tv, Clapperboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRankingEditProps {
	activeCategories: string[];
	onToggleCategory: (category: string) => void;
}

const CATEGORIES = [
	{ id: "anime", label: "Anime", icon: Clapperboard },
	{ id: "movies", label: "Movies", icon: Film },
	{ id: "games", label: "Games", icon: Gamepad2 },
	{ id: "series", label: "Series", icon: Tv },
];

const UserRankingEdit = ({
	activeCategories,
	onToggleCategory,
}: UserRankingEditProps) => {

	console.log({activeCategories});
	return (
		<div className="flex flex-col gap-3 p-2 w-content">
			<div className="flex items-center justify-between px-1">
				<h3 className="font-medium text-sm">Interest Sections</h3>
				<span className="text-[10px] text-muted-foreground">
					Click to toggle
				</span>
			</div>

			<div className="grid grid-cols-2 gap-2">
				{CATEGORIES.map((category) => {
					const Icon = category.icon;
					const isActive = activeCategories.includes(category.id);

					return (
						<button
							key={category.id}
							onClick={() => onToggleCategory(category.id)}
							className={cn(
								"flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
								isActive
									? "bg-primary/10 border-primary text-primary shadow-sm"
									: "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
							)}
						>
							<Icon
								className={cn("size-6", isActive && "fill-current opacity-20")}
							/>
							<span className="text-xs font-semibold">{category.label}</span>

							{isActive && (
								<div className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default UserRankingEdit;
