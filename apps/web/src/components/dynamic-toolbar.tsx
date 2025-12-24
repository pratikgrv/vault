"use client";

import React, { useEffect, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/useClickOutside";

const transition = {
	type: "spring",
	bounce: 0.1,
	duration: 0.25,
} as const;

export type ToolbarItem =
	| {
			id: number | string;
			type: "panel";
			label: string;
			title: React.ReactNode;
			content: React.ReactNode;
	  }
	| {
			id: number | string;
			type: "action";
			label: string;
			title: React.ReactNode;
			onClick: () => void;
	  }
	| {
			id: number | string;
			type: "custom";
			content: React.ReactNode;
	  }
	| {
			id: number | string;
			type: "separator";
	  };

interface ToolbarExpandableProps {
	items: ToolbarItem[];
}

export default function ToolbarExpandable({ items }: ToolbarExpandableProps) {
	const [active, setActive] = useState<number | string | null>(null);
	const [contentRef, { height: heightContent }] = useMeasure();
	const [menuRef, { width: widthContainer }] = useMeasure();
	const ref: React.RefObject<HTMLDivElement | null> = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	useClickOutside(ref, () => {
		setIsOpen(false);
		setActive(null);
	});

	return (
		<MotionConfig transition={transition}>
			<div
				className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center max-w-[90vw]"
				ref={ref}
			>
				<div className="w-fit rounded-xl border border-border shadow-sm bg-background overflow-hidden">
					<AnimatePresence mode="sync">
						{isOpen && active ? (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: heightContent || "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								className="overflow-hidden bg-muted/20 border-b border-border"
							>
								<div ref={contentRef} className="p-2">
									<AnimatePresence mode="popLayout" initial={false}>
										{items.map((item) => {
											if (item.type !== "panel" || item.id !== active) return null;

											return (
												<motion.div
													key={item.id}
													initial={{ opacity: 0, x: -10 }}
													animate={{
														opacity: 1,
														x: 0,
													}}
													exit={{ opacity: 0, x: -10 }}
												>
													<div className={cn("px-2 pt-2 text-sm")}>
														{item.content}
													</div>
												</motion.div>
											);
										})}
									</AnimatePresence>
								</div>
							</motion.div>
						) : null}
					</AnimatePresence>

					<div
						className="flex items-center gap-2 p-2 bg-background"
						ref={menuRef}
					>
						{items.map((item) => {
							if (item.type === "separator") {
								return (
									<div key={item.id} className="h-6 w-px bg-border mx-1" />
								);
							}

							if (item.type === "custom") {
								return <div key={item.id}>{item.content}</div>;
							}

							return (
								<button
									key={item.id}
									aria-label={item.label}
									className={cn(
										"relative flex h-10 w-10 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:scale-[0.98]",
										active === item.id ? "bg-accent text-accent-foreground" : ""
									)}
									type="button"
									onClick={() => {
										if (item.type === "action") {
											item.onClick();
											return;
										}

										if (active === item.id) {
											setIsOpen(false);
											setActive(null);
											return;
										}

										setIsOpen(true);
										setActive(item.id);
									}}
								>
									{item.title}
								</button>
							);
						})}
					</div>
				</div>
			</div>
		</MotionConfig>
	);
}
