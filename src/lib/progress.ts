"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProgressState, QuizResult, Section } from "@/lib/types";

const STORAGE_KEY = "telugu-reading-progress-v1";

function emptyState(): ProgressState {
    return {
        mastery: {},
        results: [],
        streak: { current: 0, longest: 0, lastStudyDay: "" },
    };
}

function todayKey(): string {
    return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

function load(): ProgressState {
    if (typeof window === "undefined") return emptyState();
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyState();
        const parsed = JSON.parse(raw) as Partial<ProgressState>;
        return {
            mastery: parsed.mastery ?? {},
            results: parsed.results ?? [],
            streak: parsed.streak ?? { current: 0, longest: 0, lastStudyDay: "" },
        };
    } catch {
        return emptyState();
    }
}

function save(state: ProgressState) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        /* storage unavailable — ignore */
    }
}

function bumpStreak(streak: ProgressState["streak"]): ProgressState["streak"] {
    const today = todayKey();
    if (streak.lastStudyDay === today) return streak;
    const current = streak.lastStudyDay === yesterdayKey() ? streak.current + 1 : 1;
    return {
        current,
        longest: Math.max(streak.longest, current),
        lastStudyDay: today,
    };
}

/**
 * React hook backing all progress data. Stores per-item mastery, quiz results
 * and a daily study streak in localStorage. SSR-safe.
 */
export function useProgress() {
    const [state, setState] = useState<ProgressState>(emptyState);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // Hydrate from localStorage after mount (intentional read of external state).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(load());
        setHydrated(true);
    }, []);

    // Sync across tabs.
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) setState(load());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const persist = useCallback((next: ProgressState) => {
        setState(next);
        save(next);
    }, []);

    /** Record one answer for an item; adjusts mastery level (0..5). */
    const recordAnswer = useCallback(
        (itemId: string, correct: boolean) => {
            setState((prev) => {
                const existing = prev.mastery[itemId] ?? { level: 0, seen: 0, correct: 0, lastSeen: 0 };
                const level = Math.max(0, Math.min(5, existing.level + (correct ? 1 : -1)));
                const next: ProgressState = {
                    ...prev,
                    mastery: {
                        ...prev.mastery,
                        [itemId]: {
                            level,
                            seen: existing.seen + 1,
                            correct: existing.correct + (correct ? 1 : 0),
                            lastSeen: Date.now(),
                        },
                    },
                };
                save(next);
                return next;
            });
        },
        [],
    );

    /** Record a completed quiz result and update the daily streak. */
    const recordQuiz = useCallback((result: QuizResult) => {
        setState((prev) => {
            const next: ProgressState = {
                ...prev,
                results: [result, ...prev.results].slice(0, 100),
                streak: bumpStreak(prev.streak),
            };
            save(next);
            return next;
        });
    }, []);

    const reset = useCallback(() => persist(emptyState()), [persist]);

    return { state, hydrated, recordAnswer, recordQuiz, reset };
}

/** Aggregate mastery for a set of item ids: returns 0..1 average normalized. */
export function masteryFraction(state: ProgressState, ids: string[]): number {
    if (ids.length === 0) return 0;
    let sum = 0;
    for (const id of ids) sum += (state.mastery[id]?.level ?? 0) / 5;
    return sum / ids.length;
}

/** Count of items considered "mastered" (level >= 4) in a set. */
export function masteredCount(state: ProgressState, ids: string[]): number {
    return ids.filter((id) => (state.mastery[id]?.level ?? 0) >= 4).length;
}

export function resultsForSection(state: ProgressState, section: Section): QuizResult[] {
    return state.results.filter((r) => r.section === section);
}
