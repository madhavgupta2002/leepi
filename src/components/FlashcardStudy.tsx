"use client";

import { useCallback, useEffect, useState } from "react";
import type { Card } from "@/lib/types";
import { useSettings } from "@/lib/romanization";
import { speakTelugu } from "@/lib/speech";
import { SpeakButton } from "@/components/SpeakButton";
import { ProgressBar } from "@/components/ProgressBar";
import { WordBreakdown } from "@/components/WordBreakdown";

/** Fullscreen, navigable flashcard study mode. */
export function FlashcardStudy({
    cards,
    startIndex = 0,
    onClose,
}: {
    cards: Card[];
    startIndex?: number;
    onClose: () => void;
}) {
    const { pickRoman, globalReveal, audio, autoSpeak } = useSettings();
    const [index, setIndex] = useState(startIndex);
    const [flipped, setFlipped] = useState(false);
    const [autoReveal, setAutoReveal] = useState(false);

    const total = cards.length;
    const card = cards[index];

    // Auto-play the current card's pronunciation when it changes, if enabled.
    useEffect(() => {
        if (audio && autoSpeak && card) {
            speakTelugu(card.telugu);
        }
    }, [index, audio, autoSpeak, card]);

    const go = useCallback(
        (delta: number) => {
            setIndex((i) => Math.min(total - 1, Math.max(0, i + delta)));
            setFlipped(false);
        },
        [total],
    );

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                go(1);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
            } else if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                setFlipped((f) => !f);
            } else if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [go, onClose]);

    if (!card) return null;
    const showRoman = globalReveal || autoReveal || flipped;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <span className="text-sm text-muted">
                    {index + 1} / {total}
                </span>
                <div className="flex-1 px-4">
                    <ProgressBar value={(index + 1) / total} />
                </div>
                <button
                    onClick={() => setAutoReveal((v) => !v)}
                    aria-pressed={autoReveal}
                    title="Keep answers visible on every card"
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${autoReveal
                        ? "border-accent bg-accent text-white"
                        : "border-border hover:bg-accent/10"
                        }`}
                >
                    <span
                        className={`flex h-4 w-7 items-center rounded-full px-0.5 transition ${autoReveal ? "bg-white/30" : "bg-border"
                            }`}
                    >
                        <span
                            className={`h-3 w-3 rounded-full bg-current transition ${autoReveal ? "translate-x-3" : ""
                                }`}
                        />
                    </span>
                    Auto-reveal
                </button>
                <button
                    onClick={onClose}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent/10"
                >
                    ✕ Close
                </button>
            </div>

            {/* Card */}
            <div className="flex flex-1 items-start justify-center overflow-y-auto p-4">
                <div className="w-full max-w-2xl">
                    <button
                        type="button"
                        onClick={() => setFlipped((f) => !f)}
                        className={`relative flex min-h-[40vh] w-full flex-col items-center justify-center gap-6 rounded-3xl border p-8 text-center transition ${flipped ? "border-accent/40 bg-accent-soft" : "border-border bg-card"
                            }`}
                    >
                        {card.category && (
                            <span className="absolute left-5 top-5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium capitalize text-accent">
                                {card.category}
                            </span>
                        )}
                        <div className="absolute right-5 top-5">
                            <SpeakButton text={card.telugu} />
                        </div>

                        <div className={`telugu max-w-full wrap-break-word px-2 leading-tight ${fullscreenSizeClass(card.telugu)}`}>
                            {card.telugu}
                        </div>

                        {showRoman ? (
                            <div className="space-y-2">
                                <div className="text-2xl font-semibold text-accent sm:text-3xl">{pickRoman(card.roman)}</div>
                                {card.english && <div className="text-lg font-medium">{card.english}</div>}
                                {card.example && (
                                    <div className="mt-2 rounded-xl bg-card/70 px-4 py-2 text-sm">
                                        <span className="telugu text-lg">{card.example.telugu}</span>{" "}
                                        <span className="text-muted">— {card.example.english}</span>
                                        <div className="text-amber-700 dark:text-amber-300">{pickRoman(card.example.roman)}</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-muted">tap or press space to reveal</span>
                        )}
                    </button>

                    {showRoman && <WordBreakdown text={card.telugu} className="mt-4" />}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 border-t border-border px-4 py-4">
                <button
                    onClick={() => go(-1)}
                    disabled={index === 0}
                    className="rounded-xl border border-border px-5 py-3 text-lg font-medium transition hover:bg-accent/10 disabled:opacity-30"
                    aria-label="Previous card"
                >
                    ← Prev
                </button>
                <button
                    onClick={() => setFlipped((f) => !f)}
                    className="rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90"
                >
                    Flip
                </button>
                <button
                    onClick={() => go(1)}
                    disabled={index >= total - 1}
                    className="rounded-xl border border-border px-5 py-3 text-lg font-medium transition hover:bg-accent/10 disabled:opacity-30"
                    aria-label="Next card"
                >
                    Next →
                </button>
            </div>
            <p className="pb-3 text-center text-xs text-muted">
                Arrow keys to navigate · Space to flip · Auto-reveal keeps answers shown · Esc to close
            </p>
        </div>
    );
}

/** Scale the fullscreen Telugu glyph down for long words so they never overflow. */
function fullscreenSizeClass(text: string): string {
    const n = [...text.replace(/\s+/g, "")].length;
    if (n <= 8) return "text-6xl sm:text-7xl";
    if (n <= 14) return "text-5xl sm:text-6xl";
    return "text-4xl sm:text-5xl";
}
