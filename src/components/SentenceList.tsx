"use client";

import { useMemo, useState } from "react";
import type { Card } from "@/lib/types";
import { Romanized } from "@/lib/romanization";
import { SpeakButton } from "@/components/SpeakButton";
import { FlashcardStudy } from "@/components/FlashcardStudy";
import { useProgress } from "@/lib/progress";

export function SentenceList({ cards }: { cards: Card[] }) {
    const { state, hydrated } = useProgress();
    const [level, setLevel] = useState<string>("all");
    const [query, setQuery] = useState("");
    const [studyIndex, setStudyIndex] = useState<number | null>(null);

    const levels = useMemo(
        () => Array.from(new Set(cards.map((c) => c.category).filter(Boolean) as string[])).sort(),
        [cards],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return cards.filter((c) => {
            if (level !== "all" && c.category !== level) return false;
            if (!q) return true;
            return (
                c.telugu.includes(query) ||
                c.roman.phonetic.toLowerCase().includes(q) ||
                (c.english?.toLowerCase().includes(q) ?? false)
            );
        });
    }, [cards, level, query]);

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
                <div className="flex flex-wrap gap-1.5">
                    <Chip active={level === "all"} onClick={() => setLevel("all")}>
                        All
                    </Chip>
                    {levels.map((l) => (
                        <Chip key={l} active={level === l} onClick={() => setLevel(l)}>
                            {l}
                        </Chip>
                    ))}
                </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-muted">{filtered.length} sentences</p>
                <button
                    onClick={() => setStudyIndex(0)}
                    disabled={filtered.length === 0}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                >
                    ⛶ Study fullscreen
                </button>
            </div>

            <ul className="space-y-3">
                {filtered.map((c) => {
                    const m = hydrated ? state.mastery[c.id]?.level ?? 0 : 0;
                    return (
                        <li key={c.id} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-start justify-between gap-3">
                                <p className="telugu text-2xl leading-relaxed">{c.telugu}</p>
                                <SpeakButton text={c.telugu} size="sm" />
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className="text-sm text-muted">{c.english}</span>
                                <Romanized roman={c.roman} />
                                {m > 0 && (
                                    <span className="ml-auto text-xs text-accent" title={`Mastery ${m}/5`}>
                                        {"★".repeat(Math.min(5, Math.round(m)))}
                                    </span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function Chip({
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
