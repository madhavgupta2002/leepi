"use client";

import { useMemo, useState } from "react";
import type { Card, QuizMode, Section } from "@/lib/types";
import { generateQuiz, MODE_LABELS } from "@/lib/quiz";
import { useSettings } from "@/lib/romanization";
import { QuizRunner } from "@/components/QuizRunner";
import {
    VOWELS,
    CONSONANTS,
    VOWEL_CARDS,
    CONSONANT_CARDS,
    gunintamFor,
} from "@/data/alphabet";

type Category = "pure" | "combination" | "both";

const AVAILABLE_MODES: QuizMode[] = ["te-to-roman", "roman-to-te", "audio-to-te"];

// Consonants grouped by their articulation group, preserving table order.
const CONSONANT_GROUPS: { group: string; ids: string[] }[] = (() => {
    const order: string[] = [];
    const map = new Map<string, string[]>();
    for (const c of CONSONANTS) {
        if (!map.has(c.group)) {
            map.set(c.group, []);
            order.push(c.group);
        }
        map.get(c.group)!.push(c.id);
    }
    return order.map((group) => ({ group, ids: map.get(group)! }));
})();

const ALL_VOWEL_IDS = VOWELS.map((v) => v.id);
const ALL_CONSONANT_IDS = CONSONANTS.map((c) => c.id);

export function AlphabetQuizSetup({ section }: { section: Section }) {
    const { scheme } = useSettings();
    const [category, setCategory] = useState<Category>("both");
    const [selVowels, setSelVowels] = useState<Set<string>>(() => new Set(ALL_VOWEL_IDS));
    const [selConsonants, setSelConsonants] = useState<Set<string>>(() => new Set(ALL_CONSONANT_IDS));
    const [count, setCount] = useState(20);
    const [modes, setModes] = useState<QuizMode[]>([AVAILABLE_MODES[0]]);
    const [seedNum, setSeedNum] = useState(1);
    const [started, setStarted] = useState(false);

    // Build the answer pool from the current selection + category.
    const pool = useMemo<Card[]>(() => {
        const pureVowels = VOWEL_CARDS.filter((c) => selVowels.has(c.id));
        const pureConsonants = CONSONANT_CARDS.filter((c) => selConsonants.has(c.id));
        const pure = [...pureVowels, ...pureConsonants];

        const combos: Card[] = [];
        for (const c of CONSONANTS) {
            if (!selConsonants.has(c.id)) continue;
            const all = gunintamFor(c.id); // same order as VOWELS
            VOWELS.forEach((v, idx) => {
                if (selVowels.has(v.id)) combos.push(all[idx]);
            });
        }

        if (category === "pure") return pure;
        if (category === "combination") return combos;
        return [...pure, ...combos];
    }, [category, selVowels, selConsonants]);

    const maxCount = 100;
    const effectiveCount = Math.min(count, maxCount);

    const selectionKey = `${[...selVowels].sort().join(",")}|${[...selConsonants].sort().join(",")}`;

    const questions = useMemo(() => {
        if (!started) return [];
        return generateQuiz({
            pool,
            count: effectiveCount,
            modes: modes.length ? modes : [AVAILABLE_MODES[0]],
            section,
            seed: `${section}|${category}|${selectionKey}|${modes.join(",")}|${effectiveCount}|${seedNum}|${scheme}`,
            scheme,
        });
    }, [started, pool, effectiveCount, modes, section, category, selectionKey, seedNum, scheme]);

    function toggleMode(m: QuizMode) {
        setModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
    }

    function toggleId(set: Set<string>, setter: (s: Set<string>) => void, id: string) {
        const next = new Set(set);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setter(next);
    }

    function toggleRow(set: Set<string>, setter: (s: Set<string>) => void, ids: string[]) {
        const allOn = ids.every((id) => set.has(id));
        const next = new Set(set);
        if (allOn) ids.forEach((id) => next.delete(id));
        else ids.forEach((id) => next.add(id));
        setter(next);
    }

    if (started) {
        return (
            <QuizRunner
                questions={questions}
                section={section}
                modeLabel={`${CATEGORY_LABEL[category]} · ${modes.map((m) => MODE_LABELS[m]).join(" · ")}`}
                onExit={() => {
                    setStarted(false);
                    setSeedNum((n) => n + 1);
                }}
            />
        );
    }

    const vowelsAllOn = ALL_VOWEL_IDS.every((id) => selVowels.has(id));
    const consAllOn = ALL_CONSONANT_IDS.every((id) => selConsonants.has(id));
    const canStart = modes.length > 0 && pool.length > 0;

    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">Letters & syllables practice</h2>
            <p className="mt-1 text-sm text-muted">
                Choose what to practice, pick the letters, and generate a quiz. Questions can repeat to
                reach your target count — repetition reinforces recall.
            </p>

            {/* Category */}
            <div className="mt-4">
                <p className="mb-2 text-sm font-medium">What do you want to practice?</p>
                <div className="flex flex-wrap gap-2">
                    {(["pure", "combination", "both"] as Category[]).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${category === cat
                                ? "border-accent bg-accent text-white"
                                : "border-border hover:bg-accent/10"
                                }`}
                        >
                            {CATEGORY_LABEL[cat]}
                        </button>
                    ))}
                </div>
                <p className="mt-1 text-xs text-muted">{CATEGORY_HINT[category]}</p>
            </div>

            {/* Vowel matrix */}
            <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">
                            Vowels {category === "combination" ? "(used as vowel signs)" : ""}
                        </p>
                        <button
                            onClick={() => toggleRow(selVowels, setSelVowels, ALL_VOWEL_IDS)}
                            className="rounded-md border border-border px-2 py-0.5 text-xs hover:bg-accent/10"
                        >
                            {vowelsAllOn ? "Clear row" : "Select row"}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {VOWELS.map((v) => (
                            <Cell
                                key={v.id}
                                on={selVowels.has(v.id)}
                                onClick={() => toggleId(selVowels, setSelVowels, v.id)}
                                telugu={v.telugu}
                                roman={scheme === "iso" ? v.iso : v.phonetic}
                            />
                        ))}
                    </div>
                </div>

            {/* Consonant matrix */}
            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium">Consonants</p>
                    <button
                        onClick={() => toggleRow(selConsonants, setSelConsonants, ALL_CONSONANT_IDS)}
                        className="rounded-md border border-border px-2 py-0.5 text-xs hover:bg-accent/10"
                    >
                        {consAllOn ? "Clear all" : "Select all"}
                    </button>
                </div>
                <div className="space-y-2">
                    {CONSONANT_GROUPS.map(({ group, ids }) => {
                        const rowOn = ids.every((id) => selConsonants.has(id));
                        return (
                            <div key={group} className="flex flex-wrap items-center gap-1.5">
                                <button
                                    onClick={() => toggleRow(selConsonants, setSelConsonants, ids)}
                                    className={`min-w-20 rounded-md border px-2 py-1 text-left text-xs transition ${rowOn ? "border-accent text-accent" : "border-border text-muted hover:bg-accent/10"
                                        }`}
                                    title={`Toggle all ${group}`}
                                >
                                    {group}
                                </button>
                                {ids.map((id) => {
                                    const c = CONSONANTS.find((x) => x.id === id)!;
                                    return (
                                        <Cell
                                            key={id}
                                            on={selConsonants.has(id)}
                                            onClick={() => toggleId(selConsonants, setSelConsonants, id)}
                                            telugu={c.telugu}
                                            roman={`${scheme === "iso" ? c.onsetIso : c.onsetPhonetic}a`}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pool size */}
            <p className="mt-4 text-xs text-muted">
                {pool.length} item{pool.length === 1 ? "" : "s"} in the pool
                {pool.length > 0 && pool.length < 4 && " — fewer than 4 answer choices available"}
            </p>

            {/* Count */}
            <div className="mt-4">
                <label className="flex items-center justify-between text-sm font-medium">
                    <span>Number of questions</span>
                    <span className="text-accent">{effectiveCount}</span>
                </label>
                <input
                    type="range"
                    min={3}
                    max={maxCount}
                    value={effectiveCount}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="mt-2 w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-muted">
                    <span>3</span>
                    <span>{maxCount}</span>
                </div>
            </div>

            {/* Modes */}
            <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Question types</p>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_MODES.map((m) => {
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
                    onClick={() => setStarted(true)}
                    disabled={!canStart}
                    className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                >
                    Start quiz ({effectiveCount} questions)
                </button>
                <button
                    onClick={() => setSeedNum((n) => n + 1)}
                    title="Generate a different deterministic set"
                    className="rounded-lg border border-border px-3 py-2.5 text-sm hover:bg-accent/10"
                >
                    🎲 New set
                </button>
            </div>
            {!canStart && pool.length === 0 && (
                <p className="mt-2 text-xs text-red-500">Select at least one letter to start.</p>
            )}
        </div>
    );
}

function Cell({
    on,
    onClick,
    telugu,
    roman,
}: {
    on: boolean;
    onClick: () => void;
    telugu: string;
    roman: string;
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={on}
            className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg border text-center transition ${on ? "border-accent bg-accent/15 text-accent" : "border-border text-foreground hover:bg-accent/10"
                }`}
        >
            <span className="telugu text-lg leading-none">{telugu}</span>
            <span className="mt-0.5 text-[9px] leading-none text-muted">{roman}</span>
        </button>
    );
}

const CATEGORY_LABEL: Record<Category, string> = {
    pure: "Pure letters",
    combination: "Combinations",
    both: "Both",
};

const CATEGORY_HINT: Record<Category, string> = {
    pure: "Practice standalone vowels and consonants (క, అ, మ …).",
    combination: "Practice consonant + vowel-sign syllables (కా, కి, కు …) for the letters you pick.",
    both: "Mix standalone letters and their gunintam combinations.",
};
