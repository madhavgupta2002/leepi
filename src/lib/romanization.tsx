"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Roman, RomanScheme } from "@/lib/types";

interface Settings {
    scheme: RomanScheme;
    /** When true, romanization is shown everywhere by default. Off by default
     * because the romanization is what the learner is being quizzed on. */
    globalReveal: boolean;
    /** Audio (speech synthesis) enabled. */
    audio: boolean;
}

interface SettingsContextValue extends Settings {
    setScheme: (s: RomanScheme) => void;
    toggleReveal: () => void;
    toggleAudio: () => void;
    pickRoman: (roman: Roman) => string;
}

const DEFAULTS: Settings = { scheme: "phonetic", globalReveal: false, audio: true };
const STORAGE_KEY = "telugu-reading-settings-v1";

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(DEFAULTS);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            // Hydrate persisted settings after mount (intentional external read).
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (raw) setSettings({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) });
        } catch {
            /* ignore */
        }
    }, []);

    const update = useCallback((patch: Partial<Settings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...patch };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                /* ignore */
            }
            return next;
        });
    }, []);

    const value = useMemo<SettingsContextValue>(
        () => ({
            ...settings,
            setScheme: (scheme) => update({ scheme }),
            toggleReveal: () => update({ globalReveal: !settings.globalReveal }),
            toggleAudio: () => update({ audio: !settings.audio }),
            pickRoman: (roman) => (settings.scheme === "iso" ? roman.iso : roman.phonetic),
        }),
        [settings, update],
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
    return ctx;
}

/**
 * Renders a romanization that is hidden by default and revealed on click, or
 * always shown when the global reveal toggle is on. Keeps quizzing honest while
 * still letting learners peek.
 */
export function Romanized({
    roman,
    className = "",
}: {
    roman: Roman;
    className?: string;
}) {
    const { pickRoman, globalReveal } = useSettings();
    const [revealed, setRevealed] = useState(false);
    const show = globalReveal || revealed;
    const text = pickRoman(roman);

    // When the global toggle changes, sync the local reveal to it so the global
    // button can both reveal and hide — even after an individual "show romaji".
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRevealed(globalReveal);
    }, [globalReveal]);

    if (show) {
        return <span className={`text-amber-700 dark:text-amber-300 ${className}`}>{text}</span>;
    }

    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                setRevealed(true);
            }}
            className={`inline-flex items-center gap-1 rounded-md border border-dashed border-slate-400/60 px-2 py-0.5 text-xs text-slate-500 transition hover:border-amber-400 hover:text-amber-600 dark:text-slate-400 ${className}`}
            title="Reveal romanization"
        >
            <span aria-hidden>👁</span> show romaji
        </button>
    );
}
