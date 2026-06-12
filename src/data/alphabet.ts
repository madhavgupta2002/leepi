import type { Card, Roman } from "@/lib/types";

// ---------------------------------------------------------------------------
// Authoritative, hand-curated Telugu alphabet tables.
// Single-letter romanizations are curated (not auto-transliterated) because the
// inherent vowel in consonants makes automatic single-letter romanization
// unreliable.
// ---------------------------------------------------------------------------

interface VowelDef {
  id: string;
  telugu: string;
  /** Dependent vowel sign (matra). Empty string for the inherent "a". */
  sign: string;
  iso: string;
  phonetic: string;
  example?: { telugu: string; iso: string; phonetic: string; english: string };
}

interface ConsonantDef {
  id: string;
  telugu: string;
  /** Onset romanization without the inherent vowel, e.g. "k" for క. */
  onsetIso: string;
  onsetPhonetic: string;
  group: string;
  example?: { telugu: string; iso: string; phonetic: string; english: string };
}

// అచ్చులు — vowels
export const VOWELS: VowelDef[] = [
  { id: "v-a", telugu: "అ", sign: "", iso: "a", phonetic: "a", example: { telugu: "అమ్మ", iso: "amma", phonetic: "amma", english: "mother" } },
  { id: "v-aa", telugu: "ఆ", sign: "ా", iso: "ā", phonetic: "aa", example: { telugu: "ఆవు", iso: "āvu", phonetic: "aavu", english: "cow" } },
  { id: "v-i", telugu: "ఇ", sign: "ి", iso: "i", phonetic: "i", example: { telugu: "ఇల్లు", iso: "illu", phonetic: "illu", english: "house" } },
  { id: "v-ii", telugu: "ఈ", sign: "ీ", iso: "ī", phonetic: "ee", example: { telugu: "ఈగ", iso: "īga", phonetic: "eega", english: "fly" } },
  { id: "v-u", telugu: "ఉ", sign: "ు", iso: "u", phonetic: "u", example: { telugu: "ఉడుత", iso: "uḍuta", phonetic: "uduta", english: "squirrel" } },
  { id: "v-uu", telugu: "ఊ", sign: "ూ", iso: "ū", phonetic: "oo", example: { telugu: "ఊరు", iso: "ūru", phonetic: "ooru", english: "town" } },
  { id: "v-ru", telugu: "ఋ", sign: "ృ", iso: "ṛ", phonetic: "ru", example: { telugu: "ఋషి", iso: "ṛṣi", phonetic: "rushi", english: "sage" } },
  { id: "v-e", telugu: "ఎ", sign: "ె", iso: "e", phonetic: "e", example: { telugu: "ఎలుక", iso: "eluka", phonetic: "eluka", english: "mouse" } },
  { id: "v-ee", telugu: "ఏ", sign: "ే", iso: "ē", phonetic: "ae", example: { telugu: "ఏనుగు", iso: "ēnugu", phonetic: "aenugu", english: "elephant" } },
  { id: "v-ai", telugu: "ఐ", sign: "ై", iso: "ai", phonetic: "ai", example: { telugu: "ఐదు", iso: "aidu", phonetic: "aidu", english: "five" } },
  { id: "v-o", telugu: "ఒ", sign: "ొ", iso: "o", phonetic: "o", example: { telugu: "ఒంటె", iso: "oṇṭe", phonetic: "onte", english: "camel" } },
  { id: "v-oo", telugu: "ఓ", sign: "ో", iso: "ō", phonetic: "oo", example: { telugu: "ఓడ", iso: "ōḍa", phonetic: "ooda", english: "ship" } },
  { id: "v-au", telugu: "ఔ", sign: "ౌ", iso: "au", phonetic: "au", example: { telugu: "ఔషధం", iso: "auṣadhaṁ", phonetic: "aushadham", english: "medicine" } },
];

// హల్లులు — consonants
export const CONSONANTS: ConsonantDef[] = [
  { id: "c-ka", telugu: "క", onsetIso: "k", onsetPhonetic: "k", group: "Velar", example: { telugu: "కలం", iso: "kalaṁ", phonetic: "kalam", english: "pen" } },
  { id: "c-kha", telugu: "ఖ", onsetIso: "kh", onsetPhonetic: "kh", group: "Velar" },
  { id: "c-ga", telugu: "గ", onsetIso: "g", onsetPhonetic: "g", group: "Velar", example: { telugu: "గాలి", iso: "gāli", phonetic: "gaali", english: "wind" } },
  { id: "c-gha", telugu: "ఘ", onsetIso: "gh", onsetPhonetic: "gh", group: "Velar" },
  { id: "c-nga", telugu: "ఙ", onsetIso: "ṅ", onsetPhonetic: "ng", group: "Velar" },
  { id: "c-ca", telugu: "చ", onsetIso: "c", onsetPhonetic: "ch", group: "Palatal", example: { telugu: "చేప", iso: "cēpa", phonetic: "chaepa", english: "fish" } },
  { id: "c-cha", telugu: "ఛ", onsetIso: "ch", onsetPhonetic: "chh", group: "Palatal" },
  { id: "c-ja", telugu: "జ", onsetIso: "j", onsetPhonetic: "j", group: "Palatal", example: { telugu: "జింక", iso: "jiṅka", phonetic: "jinka", english: "deer" } },
  { id: "c-jha", telugu: "ఝ", onsetIso: "jh", onsetPhonetic: "jh", group: "Palatal" },
  { id: "c-nya", telugu: "ఞ", onsetIso: "ñ", onsetPhonetic: "ny", group: "Palatal" },
  { id: "c-tta", telugu: "ట", onsetIso: "ṭ", onsetPhonetic: "t", group: "Retroflex", example: { telugu: "టమాటా", iso: "ṭamāṭā", phonetic: "tamaataa", english: "tomato" } },
  { id: "c-ttha", telugu: "ఠ", onsetIso: "ṭh", onsetPhonetic: "th", group: "Retroflex" },
  { id: "c-dda", telugu: "డ", onsetIso: "ḍ", onsetPhonetic: "d", group: "Retroflex", example: { telugu: "డబ్బు", iso: "ḍabbu", phonetic: "dabbu", english: "money" } },
  { id: "c-ddha", telugu: "ఢ", onsetIso: "ḍh", onsetPhonetic: "dh", group: "Retroflex" },
  { id: "c-nna", telugu: "ణ", onsetIso: "ṇ", onsetPhonetic: "n", group: "Retroflex" },
  { id: "c-ta", telugu: "త", onsetIso: "t", onsetPhonetic: "t", group: "Dental", example: { telugu: "తల", iso: "tala", phonetic: "tala", english: "head" } },
  { id: "c-tha", telugu: "థ", onsetIso: "th", onsetPhonetic: "th", group: "Dental" },
  { id: "c-da", telugu: "ద", onsetIso: "d", onsetPhonetic: "d", group: "Dental", example: { telugu: "దీపం", iso: "dīpaṁ", phonetic: "deepam", english: "lamp" } },
  { id: "c-dha", telugu: "ధ", onsetIso: "dh", onsetPhonetic: "dh", group: "Dental" },
  { id: "c-na", telugu: "న", onsetIso: "n", onsetPhonetic: "n", group: "Dental", example: { telugu: "నది", iso: "nadi", phonetic: "nadi", english: "river" } },
  { id: "c-pa", telugu: "ప", onsetIso: "p", onsetPhonetic: "p", group: "Labial", example: { telugu: "పండు", iso: "paṇḍu", phonetic: "pandu", english: "fruit" } },
  { id: "c-pha", telugu: "ఫ", onsetIso: "ph", onsetPhonetic: "ph", group: "Labial" },
  { id: "c-ba", telugu: "బ", onsetIso: "b", onsetPhonetic: "b", group: "Labial", example: { telugu: "బడి", iso: "baḍi", phonetic: "badi", english: "school" } },
  { id: "c-bha", telugu: "భ", onsetIso: "bh", onsetPhonetic: "bh", group: "Labial" },
  { id: "c-ma", telugu: "మ", onsetIso: "m", onsetPhonetic: "m", group: "Labial", example: { telugu: "మామిడి", iso: "māmiḍi", phonetic: "maamidi", english: "mango" } },
  { id: "c-ya", telugu: "య", onsetIso: "y", onsetPhonetic: "y", group: "Semivowel", example: { telugu: "యంత్రం", iso: "yantraṁ", phonetic: "yantram", english: "machine" } },
  { id: "c-ra", telugu: "ర", onsetIso: "r", onsetPhonetic: "r", group: "Semivowel", example: { telugu: "రవి", iso: "ravi", phonetic: "ravi", english: "sun" } },
  { id: "c-la", telugu: "ల", onsetIso: "l", onsetPhonetic: "l", group: "Semivowel", example: { telugu: "లేఖ", iso: "lēkha", phonetic: "laekha", english: "letter" } },
  { id: "c-va", telugu: "వ", onsetIso: "v", onsetPhonetic: "v", group: "Semivowel", example: { telugu: "వాన", iso: "vāna", phonetic: "vaana", english: "rain" } },
  { id: "c-sha", telugu: "శ", onsetIso: "ś", onsetPhonetic: "sh", group: "Sibilant", example: { telugu: "శరీరం", iso: "śarīraṁ", phonetic: "shareeram", english: "body" } },
  { id: "c-ssa", telugu: "ష", onsetIso: "ṣ", onsetPhonetic: "sh", group: "Sibilant" },
  { id: "c-sa", telugu: "స", onsetIso: "s", onsetPhonetic: "s", group: "Sibilant", example: { telugu: "సూర్యుడు", iso: "sūryuḍu", phonetic: "sooryudu", english: "sun" } },
  { id: "c-ha", telugu: "హ", onsetIso: "h", onsetPhonetic: "h", group: "Sibilant", example: { telugu: "హంస", iso: "haṁsa", phonetic: "hamsa", english: "swan" } },
  { id: "c-lla", telugu: "ళ", onsetIso: "ḷ", onsetPhonetic: "l", group: "Other" },
  { id: "c-ksha", telugu: "క్ష", onsetIso: "kṣ", onsetPhonetic: "ksh", group: "Other" },
  { id: "c-rra", telugu: "ఱ", onsetIso: "ṟ", onsetPhonetic: "r", group: "Other" },
];

// Vowel signs (matras) shown as a reference table.
export const MATRAS: { id: string; sign: string; iso: string; phonetic: string; baseVowel: string }[] = VOWELS.map((v) => ({
  id: `m-${v.id}`,
  sign: v.sign || "(none / inherent a)",
  iso: v.iso,
  phonetic: v.phonetic,
  baseVowel: v.telugu,
}));

// Modifiers and special marks.
export const MODIFIERS: Card[] = [
  {
    id: "mod-anusvara",
    section: "alphabet",
    telugu: "ం",
    roman: { iso: "ṁ", phonetic: "m" },
    english: "Anusvara — nasal sound, e.g. అం (am)",
    category: "modifier",
  },
  {
    id: "mod-visarga",
    section: "alphabet",
    telugu: "ః",
    roman: { iso: "ḥ", phonetic: "h" },
    english: "Visarga — aspirated ending, e.g. అః (ah)",
    category: "modifier",
  },
  {
    id: "mod-virama",
    section: "alphabet",
    telugu: "్",
    roman: { iso: "(halant)", phonetic: "(halant)" },
    english: "Virama / pollu — removes the inherent vowel from a consonant",
    category: "modifier",
  },
];

// Common conjunct consonants (ottulu) — illustrative, hand-picked.
export const CONJUNCTS: Card[] = [
  { id: "conj-kka", section: "alphabet", telugu: "క్క", roman: { iso: "kka", phonetic: "kka" }, english: "double k", category: "conjunct", example: { telugu: "అక్క", roman: { iso: "akka", phonetic: "akka" }, english: "elder sister" } },
  { id: "conj-mma", section: "alphabet", telugu: "మ్మ", roman: { iso: "mma", phonetic: "mma" }, english: "double m", category: "conjunct", example: { telugu: "అమ్మ", roman: { iso: "amma", phonetic: "amma" }, english: "mother" } },
  { id: "conj-lla", section: "alphabet", telugu: "ల్ల", roman: { iso: "lla", phonetic: "lla" }, english: "double l", category: "conjunct", example: { telugu: "ఇల్లు", roman: { iso: "illu", phonetic: "illu" }, english: "house" } },
  { id: "conj-nta", section: "alphabet", telugu: "ంత", roman: { iso: "nta", phonetic: "nta" }, english: "n + t cluster", category: "conjunct", example: { telugu: "ఒంటె", roman: { iso: "oṇṭe", phonetic: "onte" }, english: "camel" } },
  { id: "conj-tra", section: "alphabet", telugu: "త్ర", roman: { iso: "tra", phonetic: "tra" }, english: "t + r cluster", category: "conjunct", example: { telugu: "మిత్ర", roman: { iso: "mitra", phonetic: "mitra" }, english: "friend" } },
  { id: "conj-pra", section: "alphabet", telugu: "ప్ర", roman: { iso: "pra", phonetic: "pra" }, english: "p + r cluster", category: "conjunct", example: { telugu: "ప్రేమ", roman: { iso: "prēma", phonetic: "praema" }, english: "love" } },
  { id: "conj-sta", section: "alphabet", telugu: "స్త", roman: { iso: "sta", phonetic: "sta" }, english: "s + t cluster", category: "conjunct", example: { telugu: "నమస్తే", roman: { iso: "namastē", phonetic: "namastae" }, english: "greetings" } },
  { id: "conj-nda", section: "alphabet", telugu: "ండ", roman: { iso: "ṇḍa", phonetic: "nda" }, english: "n + d cluster", category: "conjunct", example: { telugu: "పండు", roman: { iso: "paṇḍu", phonetic: "pandu" }, english: "fruit" } },
];

// ---------------------------------------------------------------------------
// Derived card collections.
// ---------------------------------------------------------------------------

export const VOWEL_CARDS: Card[] = VOWELS.map((v) => ({
  id: v.id,
  section: "alphabet",
  telugu: v.telugu,
  roman: { iso: v.iso, phonetic: v.phonetic },
  category: "vowel",
  example: v.example
    ? { telugu: v.example.telugu, roman: { iso: v.example.iso, phonetic: v.example.phonetic }, english: v.example.english }
    : undefined,
}));

export const CONSONANT_CARDS: Card[] = CONSONANTS.map((c) => ({
  id: c.id,
  section: "alphabet",
  telugu: c.telugu,
  roman: { iso: `${c.onsetIso}a`, phonetic: `${c.onsetPhonetic}a` },
  category: "consonant",
  example: c.example
    ? { telugu: c.example.telugu, roman: { iso: c.example.iso, phonetic: c.example.phonetic }, english: c.example.english }
    : undefined,
}));

/** Build the full gunintam (consonant × all vowels) for one consonant. */
export function gunintamFor(consonantId: string): Card[] {
  const c = CONSONANTS.find((x) => x.id === consonantId);
  if (!c) return [];
  return VOWELS.map((v) => {
    const roman: Roman = {
      iso: `${c.onsetIso}${v.iso}`,
      phonetic: `${c.onsetPhonetic}${v.phonetic}`,
    };
    return {
      id: `g-${c.id}-${v.id}`,
      section: "alphabet" as const,
      telugu: c.telugu + v.sign,
      roman,
      category: "combination",
    };
  });
}

/** Every gunintam combination across all consonants (used as a quiz pool). */
export const ALL_COMBINATIONS: Card[] = CONSONANTS.flatMap((c) => gunintamFor(c.id));

/** Consonants that are good defaults to show combinations for. */
export const COMMON_CONSONANTS_FOR_COMBOS = [
  "c-ka",
  "c-ga",
  "c-ca",
  "c-ja",
  "c-ta",
  "c-da",
  "c-na",
  "c-pa",
  "c-ba",
  "c-ma",
  "c-ya",
  "c-ra",
  "c-la",
  "c-va",
  "c-sa",
];

/** All alphabet cards usable as a quiz answer pool. */
export const ALPHABET_CARDS: Card[] = [
  ...VOWEL_CARDS,
  ...CONSONANT_CARDS,
  ...MODIFIERS,
  ...CONJUNCTS,
];
