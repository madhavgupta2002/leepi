import type { Card } from "@/lib/types";
import wordsJson from "@/data/words.json";
import sentencesJson from "@/data/sentences.json";

interface WordRow {
    id: string;
    telugu: string;
    iso: string;
    phonetic: string;
    english: string;
    category: string;
    level: number;
}

interface SentenceRow {
    id: string;
    telugu: string;
    iso: string;
    phonetic: string;
    english: string;
    level: number;
}

export const WORD_CARDS: Card[] = (wordsJson as WordRow[]).map((w) => ({
    id: w.id,
    section: "words",
    telugu: w.telugu,
    roman: { iso: w.iso, phonetic: w.phonetic },
    english: w.english,
    category: w.category,
}));

export const SENTENCE_CARDS: Card[] = (sentencesJson as SentenceRow[]).map((s) => ({
    id: s.id,
    section: "sentences",
    telugu: s.telugu,
    roman: { iso: s.iso, phonetic: s.phonetic },
    english: s.english,
    category: `level ${s.level}`,
}));

export const WORD_CATEGORIES = Array.from(new Set((wordsJson as WordRow[]).map((w) => w.category)));
