"use client";

import * as React from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

interface AddRankingProps {
	category: string;
	editable?: boolean;
	initialRanking?: any[];
	onRankingChange?: (ranking: any[]) => void;
}

export function AddRanking({
	category,
	editable = true,
	initialRanking = [],
	onRankingChange,
}: AddRankingProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [results, setResults] = React.useState<any[]>([]);
	const [ranking, setRanking] = React.useState<any[]>(initialRanking);

	// Sync local state with prop if needed
	React.useEffect(() => {
		setRanking(initialRanking);
	}, [initialRanking]);

	// Notify parent only when user explicitly adds/removes
	const handleRankingChange = (newRanking: any[]) => {
		setRanking(newRanking);
		onRankingChange?.(newRanking);
	};

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	// Mock data for categories other than anime (since backend only supports anime for now)
	const getMockData = (query: string, category: string) => {
		const mocks: Record<string, any[]> = {
			movies: [
				{
					mal_id: 101,
					title: "Inception",
					type: "Movie",
					score: 9.5,
					imageUrl:
						"https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
					year: 2010,
				},
				{
					mal_id: 102,
					title: "The Dark Knight",
					type: "Movie",
					score: 9.8,
					imageUrl:
						"https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
					year: 2008,
				},
				{
					mal_id: 103,
					title: "Interstellar",
					type: "Movie",
					score: 9.6,
					imageUrl:
						"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
					year: 2014,
				},
			],
			games: [
				{
					mal_id: 201,
					title: "Elden Ring",
					type: "Game",
					score: 9.7,
					imageUrl:
						"https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phXeVicQLzJ4gl4XO63kKDYq.png",
					year: 2022,
				},
				{
					mal_id: 202,
					title: "God of War Ragnarök",
					type: "Game",
					score: 9.4,
					imageUrl:
						"https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
					year: 2022,
				},
			],
			series: [
				{
					mal_id: 301,
					title: "Breaking Bad",
					type: "TV",
					score: 9.9,
					imageUrl:
						"https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
					year: 2008,
				},
				{
					mal_id: 302,
					title: "Stranger Things",
					type: "TV",
					score: 9.2,
					imageUrl:
						"https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
					year: 2016,
				},
			],
		};

		const items = mocks[category.toLowerCase()] || [];

		if (!query) return items;
		return items.filter((item) =>
			item.title.toLowerCase().includes(query.toLowerCase())
		);
	};

	React.useEffect(() => {
		async function fetchData() {
			if (!search.trim()) {
				setResults([]);
				return;
			}

			// For anime, use real API
			if (category.toLowerCase() === "anime") {
				try {
					const res = await fetch(
						`/api/ranking?q=${encodeURIComponent(search)}`
					);
					const json = await res.json();
					setResults(json.data?.data || []);
				} catch (error) {
					console.error("Fetch error:", error);
					setResults([]);
				}
			}
			// For others, use mock data
			else {
				// Simulate network delay
				setTimeout(() => {
					setResults(getMockData(search, category));
				}, 300);
			}
		}
		const timer = setTimeout(fetchData, 300);
		return () => clearTimeout(timer);
	}, [search, category]);

	const addToRanking = (anime: any) => {
		if (!ranking.find((item) => item.mal_id === anime.mal_id)) {
			handleRankingChange([...ranking, anime]);
		}
		setOpen(false);
		setSearch("");
	};

	const removeFromRanking = (mal_id: number) => {
		handleRankingChange(ranking.filter((item) => item.mal_id !== mal_id));
	};
	console.log(ranking);

	return (
		<>
			<div className="w-full space-y-6 ">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<h2 className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							Featured {category}
						</h2>
						<p className="text-xs text-muted-foreground font-medium">
							My top picks and recommendations
						</p>
					</div>
					{editable && (
						<button
							onClick={() => setOpen(true)}
							className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/10 font-bold text-[11px] uppercase tracking-wider"
						>
							<Plus className="size-3.5" />
							Add Series
						</button>
					)}
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					<AnimatePresence mode="popLayout">
						{ranking.map((anime, index) => (
							<motion.div
								key={anime.mal_id}
								layout
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ type: "spring", stiffness: 400, damping: 30 }}
								className="relative group aspect-3/4 bg-muted rounded-2xl overflow-hidden border border-white/5 shadow-xl"
							>
								<img
									src={
										// anime.images.webp.large_image_url ||
										anime.imageUrl
									}
									alt={anime.title}
									className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>

								<div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

								<div className="absolute top-3 left-3 flex items-center justify-center size-6 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-lg font-bold text-[10px] shadow-lg">
									#{index + 1}
								</div>

								<div className="absolute inset-x-0 bottom-0 p-3">
									<p className="text-[11px] font-bold text-white line-clamp-1 leading-tight group-hover:whitespace-normal group-hover:line-clamp-none transition-all">
										{anime.title}
									</p>
									<div className="flex items-center gap-2 mt-1.5">
										<span className="text-[8px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/90 uppercase font-bold tracking-widest backdrop-blur-sm">
											{anime.type}
										</span>
										<span className="text-[10px] text-white/70 font-medium">
											{anime.score} ★
										</span>
									</div>
								</div>

								{editable && (
									<button
										onClick={() => removeFromRanking(anime.mal_id)}
										className="absolute top-3 right-3 size-6 bg-black/40 backdrop-blur-md text-white border border-white/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
									>
										<X className="size-3.5" />
									</button>
								)}
							</motion.div>
						))}
					</AnimatePresence>

					{editable && ranking.length < 10 && (
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							onClick={() => setOpen(true)}
							className="aspect-3/4 border-2 border-dashed border-primary/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-all group bg-white/5"
						>
							<div className="size-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
								<Plus className="size-5 text-primary/60" />
							</div>
							<span className="text-[10px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100">
								Add Series
							</span>
						</motion.button>
					)}
				</div>

				{!editable && ranking.length === 0 && (
					<div className="py-12 text-center border-2 border-dashed border-muted-foreground/10 rounded-3xl bg-white/5">
						<p className="text-sm text-muted-foreground font-medium">
							No featured series yet.
						</p>
					</div>
				)}

				<CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
					<div className="relative border-b px-3 flex items-center">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<CommandInput
							value={search}
							onValueChange={setSearch}
							placeholder="Search your favorite anime..."
							className="border-none focus:ring-0 h-11"
						/>
					</div>
					<CommandList className="max-h-[400px]">
						{search && results.length === 0 && (
							<CommandEmpty className="py-12 text-center text-sm">
								<p className="text-muted-foreground">
									No anime found matching "{search}"
								</p>
							</CommandEmpty>
						)}
						{results.length > 0 && (
							<CommandGroup heading="Series Suggestions">
								{results.map((anime) => (
									<CommandItem
										key={anime.mal_id}
										onSelect={() => addToRanking(anime)}
										className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-accent transition-colors aria-selected:bg-accent"
									>
										<div className="h-16 w-12 rounded-lg overflow-hidden shrink-0 bg-muted shadow-sm shadow-black/20 border border-white/5">
											<img
												src={anime.images.jpg.small_image_url}
												alt={anime.title}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex flex-col gap-0.5">
											<span className="font-semibold text-sm line-clamp-1">
												{anime.title}
											</span>
											<span className="text-[11px] text-muted-foreground flex items-center gap-2">
												<span className="bg-muted px-1.5 py-0.5 rounded uppercase font-bold text-[9px]">
													{anime.type}
												</span>
												{anime.year && <span>• {anime.year}</span>}
												<span>• {anime.score} ★</span>
											</span>
										</div>
										<div className="ml-auto opacity-0 group-hover:opacity-100">
											<Plus className="size-4 text-primary" />
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</CommandDialog>
			</div>
		</>
	);
}
