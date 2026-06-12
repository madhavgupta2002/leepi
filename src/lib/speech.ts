"use client";

// Thin wrapper around the Web Speech API for Telugu pronunciation. Gracefully
// degrades when no Telugu voice (or speech synthesis at all) is available.

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) cachedVoices = voices;
    return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => loadVoices();
}

export function speechSupported(): boolean {
    return typeof window !== "undefined" && !!window.speechSynthesis;
}

function pickTeluguVoice(): SpeechSynthesisVoice | undefined {
    const voices = loadVoices();
    return (
        voices.find((v) => v.lang?.toLowerCase() === "te-in") ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("te")) ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("hi")) // Hindi fallback
    );
}

/** Speak a Telugu string. Returns false if speech could not be attempted. */
export function speakTelugu(text: string): boolean {
    if (!speechSupported()) return false;
    try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const voice = pickTeluguVoice();
        if (voice) u.voice = voice;
        u.lang = voice?.lang ?? "te-IN";
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
        return true;
    } catch {
        return false;
    }
}
