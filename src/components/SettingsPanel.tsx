"use client";

import { useState } from "react";
import { useSettings } from "@/lib/romanization";

export function SettingsPanel() {
    const { scheme, setScheme, globalReveal, toggleReveal, audio, toggleAudio } = useSettings();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium transition hover:bg-accent/10"
                aria-expanded={open}
            >
                <span aria-hidden>⚙️</span> Settings
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
                    <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-xl">
                        <h3 className="mb-3 text-sm font-semibold">Display settings</h3>

                        <label className="mb-3 flex items-center justify-between gap-2 text-sm">
                            <span>
                                Show romanization
                                <span className="block text-xs text-muted">Off keeps quizzes honest</span>
                            </span>
                            <Toggle on={globalReveal} onClick={toggleReveal} />
                        </label>

                        <div className="mb-3">
                            <p className="mb-1 text-sm">Romanization style</p>
                            <div className="flex gap-1 rounded-lg border border-border p-1">
                                <SchemeButton active={scheme === "phonetic"} onClick={() => setScheme("phonetic")}>
                                    Phonetic
                                </SchemeButton>
                                <SchemeButton active={scheme === "iso"} onClick={() => setScheme("iso")}>
                                    ISO 15919
                                </SchemeButton>
                            </div>
                            <p className="mt-1 text-xs text-muted">
                                {scheme === "phonetic" ? "e.g. “ksha”, “aa”" : "e.g. “kṣa”, “ā”"}
                            </p>
                        </div>

                        <label className="flex items-center justify-between gap-2 text-sm">
                            <span>
                                Pronunciation audio
                                <span className="block text-xs text-muted">Uses your device&apos;s Telugu voice</span>
                            </span>
                            <Toggle on={audio} onClick={toggleAudio} />
                        </label>
                    </div>
                </>
            )}
        </div>
    );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            role="switch"
            aria-checked={on}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-accent" : "bg-border"}`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`}
            />
        </button>
    );
}

function SchemeButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition ${active ? "bg-accent text-white" : "hover:bg-accent/10"
                }`}
        >
            {children}
        </button>
    );
}
