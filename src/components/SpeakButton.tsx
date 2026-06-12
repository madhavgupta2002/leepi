"use client";

import { speakTelugu, speechSupported } from "@/lib/speech";
import { useSettings } from "@/lib/romanization";

export function SpeakButton({
    text,
    className = "",
    size = "md",
}: {
    text: string;
    className?: string;
    size?: "sm" | "md";
}) {
    const { audio } = useSettings();

    if (!audio) return null;

    const dim = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (!speechSupported()) return;
                speakTelugu(text);
            }}
            title="Play pronunciation"
            className={`inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent/10 hover:text-accent ${dim} ${className}`}
            aria-label="Play pronunciation"
        >
            🔊
        </button>
    );
}
