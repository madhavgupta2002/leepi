"use client";

import { useMemo, useState } from "react";
import type { Card, QuizMode, Section } from "@/lib/types";
import { generateQuiz, MODE_LABELS } from "@/lib/quiz";
import { useSettings } from "@/lib/romanization";
import { QuizRunner } from "@/components/QuizRunner";

export function QuizSetup({
    pool,
    section,
    availableModes,
    title,
}: {
    pool: Card[];
    section: Section;
    availableModes: QuizMode[];
    title: string;
}) {
    const { scheme } = useSettings();
    const [count, setCount] = useState(10);
    const [modes, setModes] = useState<QuizMode[]>([availableModes[0]]);
    const [seedNum, setSeedNum] = useState(1);
    const [started, setStarted] = useState(false);
    // Snapshot scheme at start so changing it mid-quiz doesn't reshuffle.
    const [frozenScheme, setFrozenScheme] = useState(scheme);

    const maxCount = Math.min(50, pool.length);

    const questions = useMemo(() => {
        if (!started) return [];
        return generateQuiz({
            pool,
            count: Math.min(count, maxCount),
            modes: modes.length ? modes : [availableModes[0]],
            section,
            seed: `${section}|${modes.join(",")}|${count}|${seedNum}`,
            scheme: frozenScheme,
        });
    }, [started, pool, count, modes, section, seedNum, frozenScheme, availableModes, maxCount]);

    function toggleMode(m: QuizMode) {
        setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
    }

    if (started) {
        return (
            <QuizRunner
                questions={questions}
                section={section}
                modeLabel={modes.map((m) => MODE_LABELS[m]).join(" · ")}
                onExit={() => {
                    setStarted(false);
                    setSeedNum((n) => n + 1); // fresh deterministic set next time
                }}
            />
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted">
                Deterministic quiz — the same settings always generate the same questions.
            </p>

            <div className="mt-4">
                <label className="flex items-center justify-between text-sm font-medium">
                    <span>Number of questions</span>
                    <span className="text-accent">{Math.min(count, maxCount)}</span>
                </label>
                <input
                    type="range"
                    min={3}
                    max={maxCount}
                    value={Math.min(count, maxCount)}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="mt-2 w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-muted">
                    <span>3</span>
                    <span>{maxCount}</span>
                </div>
            </div>

            <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Question types</p>
                <div className="flex flex-wrap gap-2">
                    {availableModes.map((m) => {
                        const on = modes.includes(m);
                        return (
                            <button
                                key={m}
                                onClick={() => toggleMode(m)}
                                className={`rounded-lg border px-3 py-1.5 text-sm transition ${on ? "border-accent bg-accent/15 text-accent" : "border-border hover:bg-accent/10"
                                    }`}
                            >
                                {MODE_LABELS[m]}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
                <button
                    onClick={() => { setFrozenScheme(scheme); setStarted(true); }}
                    disabled={modes.length === 0}
                    className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                >
                    Start quiz
                </button>
                <button
                    onClick={() => setSeedNum((n) => n + 1)}
                    title="Generate a different deterministic set"
                    className="rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-accent/10"
                >
                    🎲 New set
                </button>
            </div>
        </div>
    );
}
