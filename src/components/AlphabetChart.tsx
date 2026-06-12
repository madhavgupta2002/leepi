"use client";

import { VOWELS, CONSONANTS } from "@/data/alphabet";
import { useSettings } from "@/lib/romanization";

/** Compact reference sheet of vowels + consonants for quick lookup during quizzes. */
export function AlphabetChart() {
    const { scheme } = useSettings();
    const roman = (iso: string, phonetic: string) => (scheme === "iso" ? iso : phonetic);

    // Group consonants by articulation group, preserving table order.
    const groups: { group: string; items: typeof CONSONANTS }[] = [];
    for (const c of CONSONANTS) {
        let g = groups.find((x) => x.group === c.group);
        if (!g) {
            g = { group: c.group, items: [] };
            groups.push(g);
        }
        g.items.push(c);
    }

    return (
        <div className="space-y-5 text-center">
            <section>
                <h4 className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                    Vowels (అచ్చులు)
                </h4>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                    {VOWELS.map((v) => (
                        <div
                            key={v.id}
                            className="rounded-lg border border-border bg-card px-1 py-1.5"
                        >
                            <div className="telugu text-2xl leading-none">{v.telugu}</div>
                            <div className="mt-1 text-[10px] text-muted">{roman(v.iso, v.phonetic)}</div>
                        </div>
                    ))}
                </div>
            </section>

            {groups.map((g) => (
                <section key={g.group}>
                    <h4 className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                        {g.group}
                    </h4>
                    <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
                        {g.items.map((c) => (
                            <div
                                key={c.id}
                                className="rounded-lg border border-border bg-card px-1 py-1.5"
                            >
                                <div className="telugu text-2xl leading-none">{c.telugu}</div>
                                <div className="mt-1 text-[10px] text-muted">
                                    {roman(c.onsetIso, c.onsetPhonetic)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
