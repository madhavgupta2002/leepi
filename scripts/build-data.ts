/*
 * Build-time data generator.
 *
 * - Words: from the curated seed (src/data/seed-words.ts).
 * - Sentences: curated seed + best-effort fetch of Telugu→English pairs from the
 *   Tatoeba api_v0 search endpoint (CC BY 2.0 FR). If the network is unavailable
 *   the build still succeeds using the seed data alone.
 *
 * Romanizations (ISO 15919 + learner phonetic) are computed here so the runtime
 * bundle ships precomputed strings.
 *
 * Run with: npm run data:build
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { SEED_WORDS } from "../src/data/seed-words";
import { SEED_SENTENCES } from "../src/data/seed-sentences";
import { teluguToIso, isoToPhonetic } from "../src/lib/translit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "src", "data");

const MAX_SENTENCES = 300;
const SENTENCE_FETCH_PAGES = 16; // ~10 per page from api_v0
const SENTENCE_FETCH_LIMIT = 100;

interface WordRecord {
    id: string;
    telugu: string;
    iso: string;
    phonetic: string;
    english: string;
    category: string;
    level: number;
}

interface SentenceRecord {
    id: string;
    telugu: string;
    iso: string;
    phonetic: string;
    english: string;
    level: number;
}

function roman(telugu: string) {
    const iso = teluguToIso(telugu);
    return { iso, phonetic: isoToPhonetic(iso) };
}

function wordLevel(telugu: string): number {
    const n = [...telugu].length;
    if (n <= 3) return 1;
    if (n <= 6) return 2;
    return 3;
}

function sentenceLevel(telugu: string): number {
    const words = telugu.trim().split(/\s+/).length;
    if (words <= 3) return 1;
    if (words <= 6) return 2;
    return 3;
}

function buildWords(): WordRecord[] {
    return SEED_WORDS.map((w, i) => {
        const r = roman(w.telugu);
        return {
            id: `w-${i + 1}`,
            telugu: w.telugu,
            iso: r.iso,
            phonetic: r.phonetic,
            english: w.english,
            category: w.category,
            level: wordLevel(w.telugu),
        };
    });
}

interface TatoebaResult {
    text: string;
    lang: string;
    translations?: Array<Array<{ text: string; lang: string }>>;
}

async function fetchTatoebaSentences(): Promise<{ telugu: string; english: string }[]> {
    const out: { telugu: string; english: string }[] = [];
    for (let page = 1; page <= SENTENCE_FETCH_PAGES; page++) {
        const url = `https://tatoeba.org/en/api_v0/search?from=tel&to=eng&sort=words&limit=${SENTENCE_FETCH_LIMIT}&page=${page}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 30000);
        try {
            const res = await fetch(url, {
                headers: { "User-Agent": "telugu-reading-app/1.0 (educational)" },
                signal: controller.signal,
            });
            if (!res.ok) {
                console.warn(`  Tatoeba page ${page} returned HTTP ${res.status}; stopping fetch.`);
                break;
            }
            const data = (await res.json()) as { results?: TatoebaResult[] };
            const results = data.results ?? [];
            if (results.length === 0) break;
            for (const r of results) {
                const te = r.text?.trim();
                const en = r.translations?.[0]?.[0]?.text?.trim();
                if (te && en) out.push({ telugu: te, english: en });
            }
            console.log(`  Fetched Tatoeba page ${page}: ${results.length} sentences.`);
        } catch (err) {
            console.warn(`  Tatoeba fetch failed on page ${page}: ${(err as Error).message}. Using data gathered so far.`);
            break;
        } finally {
            clearTimeout(timer);
        }
    }
    return out;
}

async function buildSentences(): Promise<SentenceRecord[]> {
    const seen = new Set<string>();
    const merged: { telugu: string; english: string }[] = [];

    // Seeds first (curated, beginner-friendly), then fetched.
    for (const s of SEED_SENTENCES) {
        if (!seen.has(s.telugu)) {
            seen.add(s.telugu);
            merged.push(s);
        }
    }

    console.log("Fetching sentences from Tatoeba (best-effort)...");
    const fetched = await fetchTatoebaSentences();
    for (const s of fetched) {
        if (merged.length >= MAX_SENTENCES) break;
        if (!seen.has(s.telugu)) {
            seen.add(s.telugu);
            merged.push(s);
        }
    }

    return merged.slice(0, MAX_SENTENCES).map((s, i) => {
        const r = roman(s.telugu);
        return {
            id: `s-${i + 1}`,
            telugu: s.telugu,
            iso: r.iso,
            phonetic: r.phonetic,
            english: s.english,
            level: sentenceLevel(s.telugu),
        };
    });
}

async function main() {
    mkdirSync(OUT_DIR, { recursive: true });

    const words = buildWords();
    writeFileSync(join(OUT_DIR, "words.json"), JSON.stringify(words, null, 2) + "\n", "utf8");
    console.log(`Wrote ${words.length} words to src/data/words.json`);

    const sentences = await buildSentences();
    writeFileSync(join(OUT_DIR, "sentences.json"), JSON.stringify(sentences, null, 2) + "\n", "utf8");
    console.log(`Wrote ${sentences.length} sentences to src/data/sentences.json`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
