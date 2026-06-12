"use client";

import { useSettings } from "@/lib/romanization";

/** Compact global toggle for showing/hiding romanization everywhere. */
export function RomajiToggle({ className = "" }: { className?: string }) {
    const { globalReveal, toggleReveal } = useSettings();
    return (
        <button
            type="button"
            onClick={toggleReveal}
            role="switch"
            aria-checked={globalReveal}
            title={globalReveal ? "Hide romanization everywhere" : "Show romanization everywhere"}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition ${globalReveal
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border hover:bg-accent/10"
                } ${className}`}
        >
            <span aria-hidden>{globalReveal ? "👁" : "🚫"}</span>
            <span className="hidden sm:inline">Romaji</span>
        </button>
    );
}
