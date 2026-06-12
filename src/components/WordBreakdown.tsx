"use client";

import { breakdownByWords, type Segment } from "@/lib/breakdown";
import { useSettings } from "@/lib/romanization";

const KIND_COLOR: Record<string, string> = {
    consonant: "text-violet-500 dark:text-violet-400",
    vowel: "text-sky-500 dark:text-sky-400",
    matra: "text-sky-500 dark:text-sky-400",
    halant: "text-rose-500 dark:text-rose-400",
    anusvara: "text-amber-600 dark:text-amber-400",
    visarga: "text-amber-600 dark:text-amber-400",
    candrabindu: "text-amber-600 dark:text-amber-400",
    other: "text-muted",
};

/**
 * Per-character "Character Breakdown" of a Telugu word or sentence. When the
 * text has multiple words, each word's characters are grouped together with
 * its own romanization formula. Romanization respects the current scheme.
 */
export function WordBreakdown({
    text,
    title = "Character Breakdown",
    className = "",
}: {
    text: string;
    title?: string;
    className?: string;
}) {
    const { scheme } = useSettings();
    const groups = breakdownByWords(text);
    const totalSegments = groups.reduce((n, g) => n + g.segments.length, 0);
    if (totalSegments < 2) return null;

    const pick = (s: { iso: string; phonetic: string }) => (scheme === "iso" ? s.iso : s.phonetic);
    const multiWord = groups.length > 1;

    const renderSegments = (segments: Segment[]) => (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {segments.map((s, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center rounded-xl border border-border bg-background p-3 text-center"
                >
                    <span className="telugu text-3xl leading-tight">{s.char}</span>
                    <span className={`mt-1 text-sm font-semibold ${KIND_COLOR[s.kind]}`}>
                        {s.silent ? "(silent)" : pick(s)}
                    </span>
                    {s.description && (
                        <span className="mt-1 text-[11px] leading-snug text-muted">{s.description}</span>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className={`rounded-2xl border border-border bg-card p-4 ${className}`}>
            <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wide">{title}</h3>

            <div className="space-y-4">
                {groups.map((group, gi) => (
                    <div
                        key={gi}
                        className={multiWord ? "rounded-xl border border-border bg-background/40 p-3" : ""}
                    >
                        {multiWord && (
                            <div className="mb-2 flex items-baseline justify-center gap-2">
                                <span className="telugu text-xl">{group.word}</span>
                                <span className="text-sm font-semibold text-accent">
                                    {group.segments.map((s) => pick(s)).join(" + ")}
                                </span>
                            </div>
                        )}
                        {renderSegments(group.segments)}
                    </div>
                ))}
            </div>

            <div className="mt-3 rounded-lg bg-green-600/90 px-4 py-2 text-center font-semibold text-white">
                {groups
                    .map((g) => g.segments.map((s) => pick(s)).join(" + "))
                    .join("   •   ")}
            </div>
        </div>
    );
}
