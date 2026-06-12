"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { QuizQuestion, QuizOption, Section } from "@/lib/types";
import { useProgress } from "@/lib/progress";
import { Romanized, useSettings } from "@/lib/romanization";
import { SpeakButton } from "@/components/SpeakButton";
import { ProgressBar } from "@/components/ProgressBar";
import { WordBreakdown } from "@/components/WordBreakdown";
import { AlphabetChart } from "@/components/AlphabetChart";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** The Telugu text relevant to a question, for the character breakdown. */
function teluguOf(q: QuizQuestion): string | null {
    if (q.promptIsTelugu) return q.prompt;
    if (q.speak) return q.speak;
    const teluguOpt = q.options.find((o) => o.isTelugu && o.correct) ?? q.options.find((o) => o.isTelugu);
    return teluguOpt?.label ?? null;
}

export function QuizRunner({
    questions,
    section,
    modeLabel,
    onExit,
}: {
    questions: QuizQuestion[];
    section: Section;
    modeLabel: string;
    onExit: () => void;
}) {
    const { recordAnswer, recordQuiz } = useProgress();
    const { audio, autoSpeak, pickRoman } = useSettings();
    // One chosen option id per question (null = unanswered).
    const [answers, setAnswers] = useState<(string | null)[]>(() => questions.map(() => null));
    const [index, setIndex] = useState(0);
    const [done, setDone] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const chartAvailable = section === "alphabet";

    const total = questions.length;
    const current = questions[index];
    const chosen = answers[index];
    const answered = chosen !== null && chosen !== undefined;

    const score = useMemo(
        () =>
            questions.reduce(
                (n, q, i) => n + (q.options.find((o) => o.id === answers[i])?.correct ? 1 : 0),
                0,
            ),
        [questions, answers],
    );

    const allAnswered = answers.every((a) => a !== null);

    // Auto-play audio prompts always; auto-play any question's Telugu when the
    // global auto-speak setting is on.
    useEffect(() => {
        if (done || !current) return;
        const text = current.speak ?? (autoSpeak && audio ? teluguOf(current) : null);
        if (!text) return;
        const t = setTimeout(() => {
            import("@/lib/speech").then((m) => m.speakTelugu(text));
        }, 250);
        return () => clearTimeout(t);
    }, [current, done, autoSpeak, audio]);

    const choose = useCallback(
        (opt: QuizOption) => {
            if (answers[index] != null) return; // locked once answered
            setAnswers((prev) => {
                const next = [...prev];
                next[index] = opt.id;
                return next;
            });
            recordAnswer(current.cardId, opt.correct);
        },
        [answers, index, current, recordAnswer],
    );

    const finish = useCallback(() => {
        recordQuiz({ section, mode: modeLabel, total, correct: score, at: Date.now() });
        setDone(true);
    }, [recordQuiz, section, modeLabel, total, score]);

    const goNext = useCallback(() => {
        if (index + 1 >= total) finish();
        else setIndex((i) => i + 1);
    }, [index, total, finish]);

    const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

    // Keyboard controls: A–D to answer, ←/→ to move, Enter to advance/finish.
    useEffect(() => {
        if (done) return;
        function onKey(e: KeyboardEvent) {
            const letterIdx = ["a", "b", "c", "d", "e", "f"].indexOf(e.key.toLowerCase());
            if (letterIdx >= 0 && letterIdx < current.options.length) {
                e.preventDefault();
                choose(current.options[letterIdx]);
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                if (index + 1 < total) setIndex((i) => i + 1);
                else if (allAnswered) finish();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (answered) goNext();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [done, current, choose, index, total, allAnswered, finish, goPrev, answered, goNext]);

    if (done) {
        return (
            <QuizReview
                questions={questions}
                answers={answers}
                score={score}
                total={total}
                modeLabel={modeLabel}
                onExit={onExit}
            />
        );
    }

    if (!current) {
        return <p className="text-muted">No questions available.</p>;
    }

    const correctOption = current.options.find((o) => o.correct);

    return (
        <div className={chartAvailable && showChart ? "transition-[margin] lg:mr-84" : "transition-[margin]"}>
            <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                    <span>{modeLabel}</span>
                    <span>
                        Question {index + 1} / {total} · Score {score}
                    </span>
                </div>
                <ProgressBar value={(index + (answered ? 1 : 0)) / total} />
            </div>
            {chartAvailable && (
                <div className="mb-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => setShowChart((v) => !v)}
                        aria-pressed={showChart}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${showChart
                            ? "border-accent bg-accent text-white"
                            : "border-border hover:bg-accent/10"
                            }`}
                    >
                        <span aria-hidden>📋</span> {showChart ? "Hide chart" : "Show chart"}
                    </button>
                </div>
            )}

            {/* Prompt */}
            <div className="mb-5 rounded-2xl border border-border bg-card p-6 text-center">
                {current.promptIsTelugu ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="telugu text-5xl sm:text-6xl">{current.prompt}</div>
                        <div className="flex items-center gap-2">
                            <SpeakButton text={current.speak ?? current.prompt} size="sm" />
                            {current.promptRoman && <Romanized roman={current.promptRoman} />}
                        </div>
                    </div>
                ) : current.speak ? (
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-lg font-medium">{current.prompt}</p>
                        <SpeakButton text={current.speak} />
                    </div>
                ) : (
                    <p className="text-lg font-medium">
                        {current.promptRoman ? pickRoman(current.promptRoman) : current.prompt}
                    </p>
                )}
            </div>

            {/* Options */}
            <div className="grid gap-3 sm:grid-cols-2">
                {current.options.map((opt, i) => {
                    const isChosen = chosen === opt.id;
                    const reveal = answered && (opt.correct || isChosen);
                    const state = !answered
                        ? "idle"
                        : opt.correct
                            ? "correct"
                            : isChosen
                                ? "wrong"
                                : "dim";
                    return (
                        <button
                            key={opt.id}
                            onClick={() => choose(opt)}
                            disabled={answered}
                            className={[
                                "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                                state === "idle" && "border-border bg-card hover:border-accent hover:bg-accent/5",
                                state === "correct" && "border-green-500 bg-green-500/15 text-green-700 dark:text-green-300 animate-pop",
                                state === "wrong" && "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300",
                                state === "dim" && "border-border bg-card opacity-50",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${state === "correct"
                                    ? "border-green-500 bg-green-500 text-white"
                                    : state === "wrong"
                                        ? "border-red-500 bg-red-500 text-white"
                                        : "border-border bg-background"
                                    }`}
                            >
                                {LETTERS[i]}
                            </span>
                            <span className={`flex-1 ${opt.isTelugu ? "telugu text-3xl" : "text-lg font-medium"}`}>
                                {opt.label}
                            </span>
                            {reveal && opt.correct && <span className="text-base">✓</span>}
                            {reveal && !opt.correct && isChosen && <span className="text-base">✕</span>}
                        </button>
                    );
                })}
            </div>

            {/* Feedback */}
            {answered && (
                <div className="mt-5 space-y-4">
                    <div className="rounded-xl border border-border bg-card p-4">
                        <p className={`font-semibold ${chosen === correctOption?.id ? "text-green-600" : "text-red-600"}`}>
                            {chosen === correctOption?.id ? "Correct!" : "Not quite."}
                        </p>
                        {current.explanation && <p className="mt-1 text-sm text-muted">{current.explanation}</p>}
                    </div>
                    {teluguOf(current) && <WordBreakdown text={teluguOf(current)!} />}
                </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center gap-2">
                <button
                    onClick={goPrev}
                    disabled={index === 0}
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-accent/10 disabled:opacity-30"
                >
                    ← Prev
                </button>
                {index + 1 < total ? (
                    <button
                        onClick={goNext}
                        disabled={!answered}
                        className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                    >
                        Next question →
                    </button>
                ) : (
                    <button
                        onClick={finish}
                        disabled={!allAnswered}
                        className="flex-1 rounded-lg bg-accent px-4 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                    >
                        See results
                    </button>
                )}
            </div>
            <p className="mt-2 text-center text-xs text-muted">
                Press A–D to answer · ← → to switch questions · Enter for next
            </p>

            {/* Reference chart side panel (alphabet quizzes only). Non-modal:
                the quiz stays fully interactive while it is open. */}
            {chartAvailable && showChart && (
                <aside className="fixed right-0 top-0 z-40 flex h-full w-80 max-w-[85vw] flex-col border-l border-border bg-background shadow-2xl">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <h3 className="text-sm font-semibold">Alphabet reference</h3>
                        <button
                            type="button"
                            onClick={() => setShowChart(false)}
                            className="rounded-lg border border-border px-2.5 py-1 text-sm font-medium hover:bg-accent/10"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <AlphabetChart />
                    </div>
                </aside>
            )}
        </div>
    );
}

function QuizReview({
    questions,
    answers,
    score,
    total,
    modeLabel,
    onExit,
}: {
    questions: QuizQuestion[];
    answers: (string | null)[];
    score: number;
    total: number;
    modeLabel: string;
    onExit: () => void;
}) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    return (
        <div>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="text-5xl">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}</div>
                <h2 className="mt-2 text-xl font-bold">Quiz complete!</h2>
                <p className="mt-1 text-muted">{modeLabel}</p>
                <div className="my-4 text-4xl font-extrabold text-accent">
                    {score} / {total}
                </div>
                <ProgressBar value={total ? score / total : 0} className="mx-auto max-w-xs" />
                <p className="mt-2 text-sm text-muted">
                    {pct >= 80
                        ? "Excellent reading!"
                        : pct >= 50
                            ? "Good progress — keep going."
                            : "Review the answers below and try again."}
                </p>
                <button
                    onClick={onExit}
                    className="mt-5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent/10"
                >
                    Back
                </button>
            </div>

            <h3 className="mb-3 mt-6 font-bold">Review all questions</h3>
            <ol className="space-y-3">
                {questions.map((q, i) => {
                    const chosenId = answers[i];
                    const chosenOpt = q.options.find((o) => o.id === chosenId);
                    const correctOpt = q.options.find((o) => o.correct);
                    const isCorrect = chosenOpt?.correct ?? false;
                    return (
                        <li key={q.id} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${isCorrect ? "bg-green-500" : "bg-red-500"
                                        }`}
                                >
                                    {isCorrect ? "✓" : "✕"}
                                </span>
                                <span className="text-xs text-muted">Question {i + 1}</span>
                            </div>

                            <p className={`mt-2 ${q.promptIsTelugu ? "telugu text-2xl" : "font-medium"}`}>{q.prompt}</p>

                            <div className="mt-3 space-y-1.5 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-muted">Correct:</span>
                                    <span
                                        className={`rounded-md bg-green-500/15 px-2 py-0.5 font-medium text-green-700 dark:text-green-300 ${correctOpt?.isTelugu ? "telugu text-lg" : ""
                                            }`}
                                    >
                                        {correctOpt?.label}
                                    </span>
                                </div>
                                {!isCorrect && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-muted">Your answer:</span>
                                        <span
                                            className={`rounded-md px-2 py-0.5 font-medium ${chosenOpt ? "bg-red-500/15 text-red-700 dark:text-red-300" : "bg-border text-muted"
                                                } ${chosenOpt?.isTelugu ? "telugu text-lg" : ""}`}
                                        >
                                            {chosenOpt?.label ?? "— skipped"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {q.explanation && <p className="mt-2 text-xs text-muted">{q.explanation}</p>}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
