"use client";

import { useProgress, masteryFraction, masteredCount, resultsForSection } from "@/lib/progress";
import { ALPHABET_CARDS } from "@/data/alphabet";
import { WORD_CARDS, SENTENCE_CARDS } from "@/lib/corpus";
import { ProgressBar } from "@/components/ProgressBar";
import type { Section } from "@/lib/types";

const SECTIONS: { key: Section; label: string; ids: string[] }[] = [
    { key: "alphabet", label: "Alphabet", ids: ALPHABET_CARDS.map((c) => c.id) },
    { key: "words", label: "Words", ids: WORD_CARDS.map((c) => c.id) },
    { key: "sentences", label: "Sentences", ids: SENTENCE_CARDS.map((c) => c.id) },
];

export function ProgressDashboard() {
    const { state, hydrated, reset } = useProgress();

    if (!hydrated) {
        return <p className="text-muted">Loading your progress…</p>;
    }

    const totalQuizzes = state.results.length;
    const avgScore =
        totalQuizzes === 0
            ? 0
            : Math.round(
                (state.results.reduce((s, r) => s + (r.total ? r.correct / r.total : 0), 0) / totalQuizzes) * 100,
            );

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
                <Stat label="Current streak" value={`${state.streak.current} 🔥`} sub={`Longest ${state.streak.longest}`} />
                <Stat label="Quizzes taken" value={`${totalQuizzes}`} sub="all sections" />
                <Stat label="Average score" value={`${avgScore}%`} sub="across quizzes" />
            </div>

            <section>
                <h2 className="mb-3 font-bold">Mastery by section</h2>
                <div className="space-y-4">
                    {SECTIONS.map((s) => (
                        <div key={s.key} className="rounded-xl border border-border bg-card p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium">{s.label}</span>
                                <span className="text-sm text-muted">
                                    {masteredCount(state, s.ids)} / {s.ids.length} mastered
                                </span>
                            </div>
                            <ProgressBar value={masteryFraction(state, s.ids)} />
                            <RecentResults section={s.key} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-4">
                <h2 className="font-bold">Recent quizzes</h2>
                {state.results.length === 0 ? (
                    <p className="mt-2 text-sm text-muted">No quizzes yet — take one to start tracking.</p>
                ) : (
                    <ul className="mt-2 divide-y divide-border text-sm">
                        {state.results.slice(0, 10).map((r, i) => (
                            <li key={i} className="flex items-center justify-between py-2">
                                <span className="capitalize">{r.section}</span>
                                <span className="text-muted">{r.mode}</span>
                                <span className="font-medium text-accent">
                                    {r.correct}/{r.total}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <button
                onClick={() => {
                    if (confirm("Reset all progress? This cannot be undone.")) reset();
                }}
                className="rounded-lg border border-red-400/50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10"
            >
                Reset all progress
            </button>
        </div>
    );
}

function RecentResults({ section }: { section: Section }) {
    const { state } = useProgress();
    const results = resultsForSection(state, section).slice(0, 5);
    if (results.length === 0) return null;
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {results.map((r, i) => {
                const pct = r.total ? r.correct / r.total : 0;
                return (
                    <span
                        key={i}
                        className={`rounded-md px-2 py-0.5 text-xs ${pct >= 0.8
                                ? "bg-green-500/15 text-green-700 dark:text-green-300"
                                : pct >= 0.5
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                    : "bg-red-500/15 text-red-700 dark:text-red-300"
                            }`}
                    >
                        {r.correct}/{r.total}
                    </span>
                );
            })}
        </div>
    );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-1 text-2xl font-extrabold">{value}</p>
            <p className="text-xs text-muted">{sub}</p>
        </div>
    );
}
