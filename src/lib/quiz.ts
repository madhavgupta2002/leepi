import seedrandom from "seedrandom";
import type { Card, QuizMode, QuizQuestion, QuizOption, Section } from "@/lib/types";

// ---------------------------------------------------------------------------
// Deterministic quiz generator. Given a pool of cards, a seed, a set of modes
// and a question count, it always produces the same questions for the same
// inputs — so a learner can replay or share a quiz reproducibly.
// ---------------------------------------------------------------------------

export interface GenerateOptions {
    pool: Card[];
    count: number;
    modes: QuizMode[];
    section: Section;
    seed: string;
    /** Number of answer options per question (including the correct one). */
    optionCount?: number;
    /** Restrict romanization scheme used for roman-based prompts/options. */
    scheme?: "iso" | "phonetic";
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function romanOf(card: Card, scheme: "iso" | "phonetic"): string {
    return scheme === "iso" ? card.roman.iso : card.roman.phonetic;
}

/** Pick `n` distractor cards distinct from `answer`. */
function pickDistractors(answer: Card, pool: Card[], n: number, rng: () => number, key: (c: Card) => string): Card[] {
    const answerKey = key(answer);
    const seen = new Set<string>([answerKey]);
    const candidates = shuffle(
        pool.filter((c) => {
            const k = key(c);
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        }),
        rng,
    );
    return candidates.slice(0, n);
}

function buildQuestion(
    answer: Card,
    mode: QuizMode,
    pool: Card[],
    rng: () => number,
    optionCount: number,
    scheme: "iso" | "phonetic",
    index: number,
): QuizQuestion {
    const id = `q-${index}-${answer.id}`;

    // Configure prompt + option rendering per mode.
    let prompt = "";
    let promptIsTelugu = false;
    let speak: string | undefined;
    let optionsAreTelugu = false;
    let labelOf: (c: Card) => string;
    let dedupeKey: (c: Card) => string;

    switch (mode) {
        case "te-to-roman":
            prompt = answer.telugu;
            promptIsTelugu = true;
            labelOf = (c) => romanOf(c, scheme);
            dedupeKey = (c) => romanOf(c, scheme);
            break;
        case "roman-to-te":
            prompt = romanOf(answer, scheme);
            optionsAreTelugu = true;
            labelOf = (c) => c.telugu;
            dedupeKey = (c) => c.telugu;
            break;
        case "te-to-en":
            prompt = answer.telugu;
            promptIsTelugu = true;
            labelOf = (c) => c.english ?? romanOf(c, scheme);
            dedupeKey = (c) => c.english ?? c.id;
            break;
        case "en-to-te":
            prompt = answer.english ?? romanOf(answer, scheme);
            optionsAreTelugu = true;
            labelOf = (c) => c.telugu;
            dedupeKey = (c) => c.telugu;
            break;
        case "audio-to-te":
            prompt = "🔊 Listen and choose";
            speak = answer.telugu;
            optionsAreTelugu = true;
            labelOf = (c) => c.telugu;
            dedupeKey = (c) => c.telugu;
            break;
    }

    const distractors = pickDistractors(answer, pool, optionCount - 1, rng, dedupeKey);
    const optionCards = shuffle([answer, ...distractors], rng);
    const options: QuizOption[] = optionCards.map((c) => ({
        id: `${id}-${c.id}`,
        label: labelOf(c),
        correct: c.id === answer.id,
        isTelugu: optionsAreTelugu,
    }));

    return {
        id,
        mode,
        prompt,
        promptIsTelugu,
        speak,
        promptRoman: promptIsTelugu ? answer.roman : undefined,
        options,
        cardId: answer.id,
    };
}

export function generateQuiz(opts: GenerateOptions): QuizQuestion[] {
    const { pool, count, modes, seed } = opts;
    const optionCount = Math.min(opts.optionCount ?? 4, Math.max(2, pool.length));
    const scheme = opts.scheme ?? "phonetic";
    const rng = seedrandom(seed);

    // Cards that have what each requested mode needs (e.g. English meaning).
    const usableFor = (mode: QuizMode, c: Card): boolean => {
        if ((mode === "te-to-en" || mode === "en-to-te") && !c.english) return false;
        return true;
    };

    const effectiveModes = modes.length ? modes : (["te-to-roman"] as QuizMode[]);
    const order = shuffle(pool, rng);
    const questions: QuizQuestion[] = [];

    let i = 0;
    let guard = 0;
    while (questions.length < count && guard < count * 20) {
        guard++;
        const answer = order[i % order.length];
        i++;
        const mode = effectiveModes[questions.length % effectiveModes.length];
        if (!usableFor(mode, answer)) continue;
        // Ensure enough distractors exist for English modes.
        if ((mode === "te-to-en" || mode === "en-to-te")) {
            const withEnglish = pool.filter((c) => c.english).length;
            if (withEnglish < 2) continue;
        }
        questions.push(buildQuestion(answer, mode, pool, rng, optionCount, scheme, questions.length));
    }

    return questions;
}

export const MODE_LABELS: Record<QuizMode, string> = {
    "te-to-roman": "Telugu → Romanized",
    "roman-to-te": "Romanized → Telugu",
    "te-to-en": "Telugu → English",
    "en-to-te": "English → Telugu",
    "audio-to-te": "Listen → Telugu",
};
