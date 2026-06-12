"use client";

import { useMemo, useState } from "react";
import type { Card } from "@/lib/types";
import { Flashcard } from "@/components/Flashcard";
import { FlashcardStudy } from "@/components/FlashcardStudy";
import { useProgress } from "@/lib/progress";

export function CardBrowser({
    cards,
    categories,
}: {
    cards: Card[];
    categories?: string[];
}) {
    const { state, hydrated } = useProgress();
    const [filter, setFilter] = useState<string>("all");
    const [query, setQuery] = useState("");
    const [studyIndex, setStudyIndex] = useState<number | null>(null);

    const cats = useMemo(
        () => categories ?? Array.from(new Set(cards.map((c) => c.category).filter(Boolean) as string[])),
        [cards, categories],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return cards.filter((c) => {
            if (filter !== "all" && c.category !== filter) return false;
            if (!q) return true;
            return (
                c.telugu.includes(query) ||
                c.roman.iso.toLowerCase().includes(q) ||
                c.roman.phonetic.toLowerCase().includes(q) ||
                (c.english?.toLowerCase().includes(q) ?? false)
            );
        });
    }, [cards, filter, query]);

    return (
        <div>
            {studyIndex !== null && (
                <FlashcardStudy cards={filtered} startIndex={studyIndex} onClose={() => setStudyIndex(null)} />
            )}
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search…"
                    className="min-w-35 flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-accent"
                />
                {cats.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                            All
                        </FilterChip>
                        {cats.map((c) => (
                            <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
                                {c}
                            </FilterChip>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-muted">{filtered.length} cards</p>
                <button
                    onClick={() => setStudyIndex(0)}
                    disabled={filtered.length === 0}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                >
                    ⛶ Study fullscreen
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((card, i) => (
                    <div key={card.id} className="relative">
                        <Flashcard
                            card={card}
                            masteryLevel={hydrated ? state.mastery[card.id]?.level ?? 0 : undefined}
                        />
                        <button
                            type="button"
                            onClick={() => setStudyIndex(i)}
                            title="Open fullscreen with character breakdown"
                            aria-label="Open fullscreen study"
                            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card/90 text-sm transition hover:bg-accent/15 hover:text-accent"
                        >
                            ⛶
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FilterChip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${active ? "bg-accent text-white" : "border border-border hover:bg-accent/10"
                }`}
        >
            {children}
        </button>
    );
}
