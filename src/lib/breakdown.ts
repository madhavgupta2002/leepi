import { CONSONANTS, VOWELS } from "@/data/alphabet";

// ---------------------------------------------------------------------------
// Telugu word/akshara breakdown.
// Splits a Telugu string into its individual Unicode characters (consonants,
// vowel signs, halant, etc.) and describes each one — like a per-character
// "Character Breakdown" view.
// ---------------------------------------------------------------------------

export interface Segment {
  /** The Telugu character. */
  char: string;
  /** Romanization tokens (empty string for silent marks like the halant). */
  iso: string;
  phonetic: string;
  /** Human description of what this character is/does. */
  description: string;
  /** True for marks that carry no sound of their own (e.g. halant). */
  silent?: boolean;
  kind: "vowel" | "consonant" | "matra" | "halant" | "anusvara" | "visarga" | "candrabindu" | "other";
}

// Phonetic descriptions for each base consonant, keyed by the Telugu letter.
const CONSONANT_DESC: Record<string, string> = {
  క: "Unvoiced velar plosive (like 'k' in skip).",
  ఖ: "Aspirated velar plosive.",
  గ: "Voiced velar plosive (like 'g' in go).",
  ఘ: "Voiced aspirated velar plosive.",
  ఙ: "Velar nasal (like 'ng' in sing).",
  చ: "Unvoiced palatal affricate (like 'ch' in chip).",
  ఛ: "Aspirated palatal affricate.",
  జ: "Voiced palatal affricate (like 'j' in jam).",
  ఝ: "Voiced aspirated palatal affricate.",
  ఞ: "Palatal nasal (like 'ny' in canyon).",
  ట: "Unvoiced retroflex plosive.",
  ఠ: "Aspirated retroflex plosive.",
  డ: "Voiced retroflex plosive.",
  ఢ: "Voiced aspirated retroflex plosive.",
  ణ: "Retroflex nasal.",
  త: "Unvoiced dental plosive (like 't' in stop).",
  థ: "Aspirated dental plosive.",
  ద: "Voiced dental plosive (like 'th' in this).",
  ధ: "Voiced aspirated dental plosive.",
  న: "Dental nasal (like 'n' in net).",
  ప: "Unvoiced bilabial plosive (like 'p' in spin).",
  ఫ: "Aspirated bilabial plosive.",
  బ: "Voiced bilabial plosive (like 'b' in bat).",
  భ: "Voiced aspirated bilabial plosive.",
  మ: "Bilabial nasal (like 'm' in man).",
  య: "Palatal approximant (like 'y' in yes).",
  ర: "Alveolar trill / tap (rolled 'r').",
  ల: "Alveolar lateral (like 'l' in let).",
  వ: "Labiodental approximant (like 'v' / 'w').",
  శ: "Palatal sibilant (like 'sh' in ship).",
  ష: "Retroflex sibilant (like 'sh').",
  స: "Alveolar sibilant (like 's' in sun).",
  హ: "Glottal fricative (like 'h' in hat).",
  ళ: "Retroflex lateral.",
  ఱ: "Alveolar trill (archaic 'ra').",
};

// Names for vowel signs (matras), keyed by the sign character.
const MATRA_NAME: Record<string, string> = {
  "ా": "kaaru — long 'aa' vowel sign.",
  "ి": "gudi — short 'i' vowel sign.",
  "ీ": "gudi deergham — long 'ee' vowel sign.",
  "ు": "kommu — short 'u' vowel sign.",
  "ూ": "kommu deergham — long 'oo' vowel sign.",
  "ృ": "vattu — 'ru' vowel sign.",
  "ె": "etva — short 'e' vowel sign.",
  "ే": "etva deergham — long 'ae' vowel sign.",
  "ై": "ai vowel sign.",
  "ొ": "otva — short 'o' vowel sign.",
  "ో": "otva deergham — long 'oo' vowel sign.",
  "ౌ": "au vowel sign.",
};

// Build lookup maps from the curated alphabet data.
const consonantByChar = new Map(CONSONANTS.map((c) => [c.telugu, c]));
const vowelByChar = new Map(VOWELS.map((v) => [v.telugu, v]));
const matraBySign = new Map(VOWELS.filter((v) => v.sign).map((v) => [v.sign, v]));

const HALANT = "\u0C4D"; // ్
const ANUSVARA = "\u0C02"; // ం
const VISARGA = "\u0C03"; // ః
const CANDRABINDU = "\u0C01"; // ఁ

function classify(ch: string): Segment | null {
  if (/\s/.test(ch)) return null; // skip spaces between words

  if (ch === HALANT) {
    return {
      char: ch,
      iso: "",
      phonetic: "",
      silent: true,
      kind: "halant",
      description:
        "Halant / pollu — removes the inherent 'a' vowel from a consonant, making it pure or forming a conjunct.",
    };
  }
  if (ch === ANUSVARA) {
    return {
      char: ch,
      iso: "ṁ",
      phonetic: "m",
      kind: "anusvara",
      description: "Anusvara (sunna) — nasalizes the preceding vowel ('m' / 'n').",
    };
  }
  if (ch === VISARGA) {
    return {
      char: ch,
      iso: "ḥ",
      phonetic: "h",
      kind: "visarga",
      description: "Visarga — a soft aspirated 'h' ending.",
    };
  }
  if (ch === CANDRABINDU) {
    return {
      char: ch,
      iso: "m̐",
      phonetic: "m",
      kind: "candrabindu",
      description: "Candrabindu — nasalization of the vowel.",
    };
  }

  const cons = consonantByChar.get(ch);
  if (cons) {
    return {
      char: ch,
      iso: `${cons.onsetIso}a`,
      phonetic: `${cons.onsetPhonetic}a`,
      kind: "consonant",
      description: CONSONANT_DESC[ch] ?? `${cons.group} consonant.`,
    };
  }

  const vowel = vowelByChar.get(ch);
  if (vowel) {
    return {
      char: ch,
      iso: vowel.iso,
      phonetic: vowel.phonetic,
      kind: "vowel",
      description: `Independent vowel '${vowel.phonetic}'.`,
    };
  }

  const matra = matraBySign.get(ch);
  if (matra) {
    return {
      char: ch,
      iso: matra.iso,
      phonetic: matra.phonetic,
      kind: "matra",
      description: MATRA_NAME[ch] ?? `Vowel sign '${matra.phonetic}'.`,
    };
  }

  // Unknown / punctuation / digits — show as-is with no description.
  return { char: ch, iso: ch, phonetic: ch, kind: "other", description: "" };
}

/** Split a Telugu string into described character segments. */
export function breakdownWord(text: string): Segment[] {
  const out: Segment[] = [];
  for (const ch of text) {
    const seg = classify(ch);
    if (seg) out.push(seg);
  }
  return out;
}

export interface WordGroup {
  /** The original word text. */
  word: string;
  segments: Segment[];
}

/**
 * Split a (possibly multi-word) Telugu string into per-word groups, each with
 * its own described character segments. Punctuation is trimmed from word
 * boundaries so the displayed word stays clean.
 */
export function breakdownByWords(text: string): WordGroup[] {
  return text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
    .map((word) => ({ word, segments: breakdownWord(word) }))
    .filter((g) => g.segments.length > 0);
}
