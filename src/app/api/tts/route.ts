import { NextRequest } from "next/server";

// Server-side Telugu text-to-speech proxy.
// Browsers cannot call Google Translate's TTS endpoint directly (it rejects
// cross-origin / refererless requests with 403). Proxying through our own
// origin with browser-like headers makes it reliable and CORS-free.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Google's tw-ob TTS endpoint accepts up to ~200 characters per request.
const MAX_LEN = 200;

function ttsUrl(text: string, lang: string): string {
    const q = encodeURIComponent(text);
    return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${q}`;
}

export async function GET(req: NextRequest) {
    const text = (req.nextUrl.searchParams.get("q") ?? "").slice(0, MAX_LEN).trim();
    const lang = req.nextUrl.searchParams.get("lang") ?? "te";

    if (!text) {
        return new Response("Missing q", { status: 400 });
    }

    try {
        const upstream = await fetch(ttsUrl(text, lang), {
            headers: {
                // Browser-like headers so Google serves the audio.
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
                Referer: "https://translate.google.com/",
                "Accept-Language": `${lang},en;q=0.9`,
            },
            // Avoid hanging requests.
            signal: AbortSignal.timeout(10_000),
        });

        if (!upstream.ok || !upstream.body) {
            return new Response(`Upstream error ${upstream.status}`, { status: 502 });
        }

        return new Response(upstream.body, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                // Cache identical clips at the edge/browser for a day.
                "Cache-Control": "public, max-age=86400, immutable",
            },
        });
    } catch {
        return new Response("TTS fetch failed", { status: 504 });
    }
}
