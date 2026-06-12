"use client";

// Telugu pronunciation helper.
// Prefers a native OS Telugu voice via the Web Speech API. When none exists
// (e.g. Windows has no Telugu text-to-speech pack), it falls back to an online
// Telugu TTS audio stream so sound still works.

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
    return typeof window !== "undefined" && (!!window.speechSynthesis || typeof Audio !== "undefined");
}

function pickTeluguVoice(): SpeechSynthesisVoice | undefined {
    const voices = loadVoices();
    return (
        voices.find((v) => v.lang?.toLowerCase() === "te-in") ??
        voices.find((v) => v.lang?.toLowerCase().startsWith("te"))
        // NOTE: No Hindi fallback — Hindi voice speaks incorrect phonetics for Telugu text.
    );
}

/** True when the OS provides a native Telugu TTS voice. */
export function hasNativeTeluguVoice(): boolean {
    return !!pickTeluguVoice();
}

// ---- Online fallback (server-proxied Google Translate TTS) ----
let currentAudio: HTMLAudioElement | null = null;

function onlineTtsUrl(text: string): string {
    // Routed through our own /api/tts proxy to avoid CORS / referer blocks.
    const q = encodeURIComponent(text.slice(0, 200));
    return `/api/tts?lang=te&q=${q}`;
}

function onlineSpeak(text: string): boolean {
    if (typeof Audio === "undefined") return false;
    try {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        const audio = new Audio(onlineTtsUrl(text));
        audio.playbackRate = 0.9;
        currentAudio = audio;
        void audio.play().catch(() => {
            /* autoplay/network errors are non-fatal */
        });
        return true;
    } catch {
        return false;
    }
}

/**
 * Speak a Telugu string.
 * Uses a native Telugu voice when available; otherwise streams TTS audio via
 * our server proxy. If the native voice errors out, falls back to online.
 */
export function speakTelugu(text: string): boolean {
    if (typeof window === "undefined") return false;

    const voice = window.speechSynthesis ? pickTeluguVoice() : undefined;

    if (voice) {
        try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.voice = voice;
            u.lang = voice.lang || "te-IN";
            u.rate = 0.85;
            // If the native engine fails mid-flight, use the online fallback.
            u.onerror = () => onlineSpeak(text);
            window.speechSynthesis.speak(u);
            return true;
        } catch {
            return onlineSpeak(text);
        }
    }

    // No native Telugu voice — go straight to the online proxy.
    return onlineSpeak(text);
}
