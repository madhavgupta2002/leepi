"use client";

import Link from "next/link";
import { useProgress, masteryFraction, masteredCount } from "@/lib/progress";
import { ALPHABET_CARDS } from "@/data/alphabet";
import { WORD_CARDS, SENTENCE_CARDS } from "@/lib/corpus";
import { ProgressBar } from "@/components/ProgressBar";

const SECTIONS = [
    {
        href: "/alphabet",
        emoji: "అ",
        title: "Alphabet",
        blurb: "Vowels, consonants, vowel signs and combinations (gunintalu).",
        ids: ALPHABET_CARDS.map((c) => c.id),
    },
    {
        href: "/words",
        emoji: "పదం",
        title: "Words",
        blurb: "Everyday vocabulary with meanings and pronunciation.",
        ids: WORD_CARDS.map((c) => c.id),
    },
    {
        href: "/sentences",
        emoji: "వాక్యం",
        title: "Sentences",
        blurb: "Read full sentences and build reading fluency.",
        ids: SENTENCE_CARDS.map((c) => c.id),
    },
];

export function HomeDashboard() {
    const { state, hydrated } = useProgress();

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-border bg-gradient-to-br from-accent/10 to-transparent p-6 sm:p-8">
                <p className="telugu text-sm font-medium text-accent">తెలుగు చదవడం నేర్చుకోండి</p>
                <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Learn to read Telugu</h1>
                <p className="mt-2 max-w-xl text-muted">
                    Master the script step by step — from letters to words to sentences — with
                    flashcards, smart quizzes, audio and progress that saves in your browser.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Link href="/alphabet" className="rounded-lg bg-accent px-4 py-2.5 font-medium text-white hover:opacity-90">
                        Start with the alphabet
                    </Link>
                    <Link href="/progress" className="rounded-lg border border-border px-4 py-2.5 font-medium hover:bg-accent/10">
                        View progress
                    </Link>
                </div>
                {hydrated && state.streak.current > 0 && (
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm">
                        🔥 <strong>{state.streak.current}-day</strong> streak — keep it up!
                    </p>
                )}
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
                {SECTIONS.map((s, i) => {
                    const frac = hydrated ? masteryFraction(state, s.ids) : 0;
                    const mastered = hydrated ? masteredCount(state, s.ids) : 0;
                    return (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <span className="telugu flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-xl text-accent">
                                    {s.emoji}
                                </span>
                                <div>
                                    <span className="text-xs text-muted">Step {i + 1}</span>
                                    <h2 className="font-bold">{s.title}</h2>
                                </div>
                            </div>
                            <p className="mt-2 flex-1 text-sm text-muted">{s.blurb}</p>
                            <div className="mt-3">
                                <ProgressBar value={frac} />
                                <p className="mt-1 text-xs text-muted">
                                    {mastered} / {s.ids.length} mastered
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-bold">How it works</h2>
                <ul className="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2">
                    <li>📇 Flip flashcards to learn each letter, word and sentence.</li>
                    <li>🧠 Take quizzes that ask Telugu → romanized and the reverse.</li>
                    <li>👁 Romanization is hidden by default — tap “show romaji” to peek.</li>
                    <li>🔊 Hear pronunciation with your device&apos;s Telugu voice.</li>
                    <li>🎯 Choose how many questions you want — quizzes are deterministic.</li>
                    <li>💾 Your mastery, scores and streak are saved locally.</li>
                </ul>
            </section>
        </div>
    );
}
