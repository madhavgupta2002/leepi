import type { CuratedQuiz, QuizOption, QuizQuestion, Section } from "@/lib/types";

// ---------------------------------------------------------------------------
// Hand-authored quizzes that test real reading skill — syllable blending,
// matra recognition, odd-one-out, minimal pairs and short comprehension —
// rather than simple one-to-one field mapping.
// ---------------------------------------------------------------------------

let counter = 0;
function opt(label: string, correct = false, isTelugu = false): QuizOption {
  return { id: `cqo-${counter++}`, label, correct, isTelugu };
}

interface Q {
  prompt: string;
  promptIsTelugu?: boolean;
  speak?: string;
  options: QuizOption[];
  explanation?: string;
}

function q(item: Q, section: Section, index: number): QuizQuestion {
  return {
    id: `cq-${section}-${index}`,
    mode: "te-to-roman",
    prompt: item.prompt,
    promptIsTelugu: item.promptIsTelugu ?? false,
    speak: item.speak,
    options: item.options,
    cardId: `curated-${section}-${index}`,
    explanation: item.explanation,
  };
}

// --- Alphabet ---------------------------------------------------------------

const alphabetReading: Q[] = [
  {
    prompt: "కి",
    promptIsTelugu: true,
    options: [opt("ki", true), opt("ku"), opt("ka"), opt("kee")],
    explanation: "క (k) + the 'i' sign ి = ki.",
  },
  {
    prompt: "మా",
    promptIsTelugu: true,
    options: [opt("maa", true), opt("ma"), opt("mi"), opt("mu")],
    explanation: "మ (ma) + the long 'aa' sign ా = maa.",
  },
  {
    prompt: "తో",
    promptIsTelugu: true,
    options: [opt("too", true), opt("ta"), opt("ti"), opt("tu")],
    explanation: "త (ta) + the long 'oo' sign ో = too.",
  },
  {
    prompt: "నే",
    promptIsTelugu: true,
    options: [opt("nae", true), opt("na"), opt("ni"), opt("nu")],
    explanation: "న (na) + the long 'ē' sign ే = nae.",
  },
  {
    prompt: "పు",
    promptIsTelugu: true,
    options: [opt("pu", true), opt("pa"), opt("po"), opt("pi")],
    explanation: "ప (pa) + the 'u' sign ు = pu.",
  },
];

const alphabetOddOne: Q[] = [
  {
    prompt: "Which one is a vowel (achchu)?",
    options: [opt("ఆ", true, true), opt("క", false, true), opt("మ", false, true), opt("ప", false, true)],
    explanation: "ఆ is the long vowel 'aa'. The others are consonants.",
  },
  {
    prompt: "Which one is a consonant (hallu)?",
    options: [opt("క", true, true), opt("ఇ", false, true), opt("ఈ", false, true), opt("ఉ", false, true)],
    explanation: "క (ka) is a consonant; the rest are vowels.",
  },
  {
    prompt: "Which syllable says “tu”?",
    options: [opt("తు", true, true), opt("తూ", false, true), opt("తి", false, true), opt("తో", false, true)],
    explanation: "తు = tu (short u). తూ = too, తి = ti, తో = too(long o).",
  },
];

const alphabetSyllables: Q[] = [
  {
    prompt: "How many syllables are in the word: పుస్తకం (book)?",
    options: [opt("3", true), opt("2"), opt("4"), opt("5")],
    explanation: "పు-స్త-కం → pu-sta-kam = 3 syllables.",
  },
  {
    prompt: "How many syllables are in: అమ్మ (mother)?",
    options: [opt("2", true), opt("1"), opt("3"), opt("4")],
    explanation: "అ-మ్మ → am-ma = 2 syllables (మ్మ is a doubled m).",
  },
];

// --- Words ------------------------------------------------------------------

const wordsReading: Q[] = [
  {
    prompt: "నీరు",
    promptIsTelugu: true,
    options: [opt("water", true), opt("fire"), opt("tree"), opt("house")],
    explanation: "నీరు (neeru) = water.",
  },
  {
    prompt: "Read it, then pick the meaning: ఇల్లు",
    promptIsTelugu: true,
    options: [opt("house", true), opt("school"), opt("road"), opt("market")],
    explanation: "ఇల్లు (illu) = house.",
  },
  {
    prompt: "Which word means “mother”?",
    options: [opt("అమ్మ", true, true), opt("నాన్న", false, true), opt("అక్క", false, true), opt("అన్న", false, true)],
    explanation: "అమ్మ (amma) = mother. నాన్న = father.",
  },
  {
    prompt: "Odd one out — which is NOT an animal?",
    options: [opt("పండు", true, true), opt("కుక్క", false, true), opt("పిల్లి", false, true), opt("ఆవు", false, true)],
    explanation: "పండు (pandu) = fruit. The others are dog, cat, cow.",
  },
  {
    prompt: "Listen and choose the word for “water”.",
    speak: "నీరు",
    options: [opt("నీరు", true, true), opt("నిప్పు", false, true), opt("పాలు", false, true), opt("గాలి", false, true)],
    explanation: "నీరు (neeru) = water; నిప్పు = fire; పాలు = milk; గాలి = wind.",
  },
];

// --- Sentences --------------------------------------------------------------

const sentenceComprehension: Q[] = [
  {
    prompt: "Read: «నా పేరు రవి.» — What is the person's name?",
    promptIsTelugu: false,
    options: [opt("Ravi", true), opt("Sita"), opt("Kiran"), opt("Anu")],
    explanation: "నా పేరు రవి = “My name is Ravi.”",
  },
  {
    prompt: "Read: «పిల్లి పాలు తాగుతోంది.» — What is the cat doing?",
    options: [opt("drinking milk", true), opt("eating fish"), opt("sleeping"), opt("running")],
    explanation: "పిల్లి (cat) పాలు (milk) తాగుతోంది (is drinking).",
  },
  {
    prompt: "Read: «ఈ రోజు వాన పడుతోంది.» — What is the weather?",
    options: [opt("it is raining", true), opt("it is sunny"), opt("it is windy"), opt("it is snowing")],
    explanation: "వాన (rain) పడుతోంది (is falling) = it is raining.",
  },
  {
    prompt: "Which sentence means “Thank you”?",
    options: [
      opt("మీకు ధన్యవాదాలు.", true, true),
      opt("నీ పేరు ఏమిటి?", false, true),
      opt("ఇది ఎంత?", false, true),
      opt("ఇక్కడికి రండి.", false, true),
    ],
    explanation: "మీకు ధన్యవాదాలు = Thank you.",
  },
];

export const CURATED_QUIZZES: CuratedQuiz[] = [
  {
    id: "cq-alpha-reading",
    section: "alphabet",
    title: "Blend the syllables",
    description: "Combine each consonant with its vowel sign and read it aloud.",
    questions: alphabetReading.map((item, i) => q(item, "alphabet", i)),
  },
  {
    id: "cq-alpha-odd",
    section: "alphabet",
    title: "Spot the letter",
    description: "Tell vowels from consonants and recognise matras.",
    questions: alphabetOddOne.map((item, i) => q(item, "alphabet", 100 + i)),
  },
  {
    id: "cq-alpha-syllables",
    section: "alphabet",
    title: "Count the syllables",
    description: "Break words into their syllable beats.",
    questions: alphabetSyllables.map((item, i) => q(item, "alphabet", 200 + i)),
  },
  {
    id: "cq-words-reading",
    section: "words",
    title: "Read & understand words",
    description: "Read the Telugu word, then choose the right meaning.",
    questions: wordsReading.map((item, i) => q(item, "words", i)),
  },
  {
    id: "cq-sentences-comprehension",
    section: "sentences",
    title: "Reading comprehension",
    description: "Read each short sentence and answer the question.",
    questions: sentenceComprehension.map((item, i) => q(item, "sentences", i)),
  },
];

export function curatedForSection(section: Section): CuratedQuiz[] {
  return CURATED_QUIZZES.filter((q) => q.section === section);
}
