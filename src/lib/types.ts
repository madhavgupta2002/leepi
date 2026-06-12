// Shared domain types for the Telugu reading app.

export type RomanScheme = "phonetic" | "iso";

export type Section = "alphabet" | "words" | "sentences";

/** A romanization pair so either scheme can be displayed on demand. */
export interface Roman {
    iso: string;
    phonetic: string;
}

/** Generic learnable item used by flashcards and as a quiz answer pool. */
export interface Card {
    id: string;
    section: Section;
    /** Telugu script text (the thing being learned to read). */
    telugu: string;
    /** Romanization in both schemes. */
    roman: Roman;
    /** English meaning / gloss (empty for pure letters that have no meaning). */
    english?: string;
    /** Sub-grouping used for browsing (e.g. "vowel", "consonant", "noun"). */
    category?: string;
    /** Optional illustrative example (used by alphabet letters). */
    example?: {
        telugu: string;
        roman: Roman;
        english: string;
    };
}

export type QuizMode =
    | "te-to-roman" // show Telugu, choose romanization
    | "roman-to-te" // show romanization, choose Telugu
    | "te-to-en" // show Telugu, choose English meaning
    | "en-to-te" // show English, choose Telugu
    | "audio-to-te"; // hear pronunciation, choose Telugu

export interface QuizOption {
    id: string;
    /** Text rendered on the option button. */
    label: string;
    /** True for the single correct option. */
    correct: boolean;
    /** When true, the label is Telugu script (affects font + romanize toggle). */
    isTelugu: boolean;
}

export interface QuizQuestion {
    id: string;
    mode: QuizMode;
    /** The prompt text shown to the user. */
    prompt: string;
    /** True when the prompt is Telugu script. */
    promptIsTelugu: boolean;
    /** For audio questions, the Telugu text to speak. */
    speak?: string;
    /** Romanization of the prompt, revealed via the toggle when prompt is Telugu. */
    promptRoman?: Roman;
    options: QuizOption[];
    /** Id of the source card, for progress tracking. */
    cardId: string;
    /** Optional teaching note shown after answering (used by curated quizzes). */
    explanation?: string;
}

/** A fully authored quiz that goes beyond simple field mapping. */
export interface CuratedQuiz {
    id: string;
    section: Section;
    title: string;
    description: string;
    questions: QuizQuestion[];
}

/** Per-item mastery record. */
export interface ItemMastery {
    /** 0 (unseen) .. 5 (mastered). */
    level: number;
    seen: number;
    correct: number;
    lastSeen: number; // epoch ms
}

export interface QuizResult {
    section: Section;
    mode: string;
    total: number;
    correct: number;
    at: number; // epoch ms
}

export interface ProgressState {
    mastery: Record<string, ItemMastery>;
    results: QuizResult[];
    streak: {
        current: number;
        longest: number;
        lastStudyDay: string; // YYYY-MM-DD
    };
}
