"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { Romanized, useSettings } from "@/lib/romanization";
import { SpeakButton } from "@/components/SpeakButton";

export function Flashcard({ card, masteryLevel }: { card: Card; masteryLevel?: number }) {
    const [flipped, setFlipped] = useState(false);
    const { pickRoman, globalReveal } = useSettings();

    return (
        <div className="[perspective:1200px]">
            <div
                role="button"
                tabIndex={0}
                onClick={() => setFlipped((f) => !f)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setFlipped((f) => !f);
                    }
                }}
                className={`flip relative h-44 w-full cursor-pointer select-none rounded-2xl ${flipped ? "flipped" : ""}`}
            >
                {/* Front */}
                <div className="flip-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
                    {typeof masteryLevel === "number" && <MasteryDots level={masteryLevel} />}
                    <div className="telugu text-5xl sm:text-6xl">{card.telugu}</div>
                    {globalReveal && (
                        <div className="text-sm text-amber-700 dark:text-amber-300">{pickRoman(card.roman)}</div>
                    )}
                    <div className="absolute bottom-2 right-2">
                        <SpeakButton text={card.telugu} size="sm" />
                    </div>
                    <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-wide text-muted">
                        tap to flip
                    </span>
                </div>

                {/* Back */}
                <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent-soft p-4 text-center">
                    <div className="text-2xl font-semibold text-accent">{pickRoman(card.roman)}</div>
                    {card.english && <div className="text-sm font-medium">{card.english}</div>}
                    {card.example && (
                        <div className="mt-1 rounded-lg bg-card/70 px-3 py-1.5 text-xs">
                            <span className="telugu text-base">{card.example.telugu}</span>{" "}
                            <span className="text-muted">— {card.example.english}</span>
                            <div className="mt-0.5">
                                <Romanized roman={card.example.roman} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MasteryDots({ level }: { level: number }) {
    return (
        <div className="absolute left-2 top-2 flex gap-0.5" title={`Mastery ${level}/5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i < level ? "bg-accent" : "bg-border"}`}
                />
            ))}
        </div>
    );
}
