"use client";

// Thin wrapper around the Web Speech API for Telugu pronunciation. Gracefully
// degrades when no suitable voice is available.

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
    if (typeof window === "undefined" || !window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) cachedVoices = voices;
    return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speechSupported(): boolean {
    return typeof window !== "undefined" && !!window.speechSynthesis;
}

function pickTeluguVoice(): SpeechSynthesisVoice | undefined {
    const voices = loadVoices();
    return (
        voices.find((v) => v.lang?.toLowerCase() === "te-in") ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("te"))
        // NOTE: No Hindi fallback — Hindi voice speaks incorrect phonetics for Telugu text.
    );
}

function doSpeak(text: string): boolean {
    try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const voice = pickTeluguVoice();
        if (voice) u.voice = voice;
        u.lang = "te-IN";
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
        return true;
    } catch {
        return false;
    }
}

/**
 * Speak a Telugu string.
 * If voices haven't loaded yet (Chrome loads them async), waits up to 1 s
 * then retries. Returns false only if the Speech API is absent.
 */
export function speakTelugu(text: string): boolean {
    if (!speechSupported()) return false;

    // Voices already available — speak immediately.
    if (cachedVoices.length > 0) return doSpeak(text);

    // Voices not yet loaded — wait for them then speak.
    // (Chrome fires onvoiceschanged asynchronously after the first call.)
    window.speechSynthesis.getVoices(); // nudge Chrome to populate
    setTimeout(() => {
        loadVoices();
        doSpeak(text);
    }, 500);

    return true; // will play after the short delay
}
