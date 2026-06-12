"use client";

import { useEffect, useState } from "react";
import { speakTelugu, speechSupported } from "@/lib/speech";
import { useSettings } from "@/lib/romanization";

function hasTeluguVoice(): boolean {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;
    const voices = window.speechSynthesis.getVoices();
    return voices.some(
        (v) => v.lang?.toLowerCase() === "te-in" || v.lang?.toLowerCase().startsWith("te"),
    );
}

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
    const [noVoice, setNoVoice] = useState(false);

    // Check voice availability once voices are loaded (Chrome fires onvoiceschanged async).
    useEffect(() => {
        if (!speechSupported()) return;
        function check() {
            setNoVoice(!hasTeluguVoice());
        }
        check();
        window.speechSynthesis.addEventListener("voiceschanged", check);
        return () => window.speechSynthesis.removeEventListener("voiceschanged", check);
    }, []);

    if (!audio) return null;

    const dim = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";

    const title = !speechSupported()
        ? "Speech not supported in this browser"
        : noVoice
            ? "No Telugu voice found — install the Telugu language pack in Windows Settings → Time & Language → Language & Region, then restart your browser"
            : "Play pronunciation";

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                if (!speechSupported()) return;
                speakTelugu(text);
            }}
            title={title}
            className={`inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-accent/10 hover:text-accent ${dim} ${noVoice || !speechSupported() ? "opacity-40 cursor-help" : ""} ${className}`}
            aria-label="Play pronunciation"
        >
            {noVoice ? "🔇" : "🔊"}
        </button>
    );
}
