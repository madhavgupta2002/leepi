// Curated beginner word seed (Telugu + English meaning + category).
// Romanizations are generated at build time by scripts/build-data.ts, so they
// stay consistent with the transliteration rules used across the app.
export interface SeedWord {
    telugu: string;
    english: string;
    category: string;
}

export const SEED_WORDS: SeedWord[] = [
    // People & family
    { telugu: "అమ్మ", english: "mother", category: "people" },
    { telugu: "నాన్న", english: "father", category: "people" },
    { telugu: "అక్క", english: "elder sister", category: "people" },
    { telugu: "అన్న", english: "elder brother", category: "people" },
    { telugu: "తమ్ముడు", english: "younger brother", category: "people" },
    { telugu: "చెల్లి", english: "younger sister", category: "people" },
    { telugu: "బిడ్డ", english: "child", category: "people" },
    { telugu: "స్నేహితుడు", english: "friend", category: "people" },
    { telugu: "మనిషి", english: "person", category: "people" },
    { telugu: "గురువు", english: "teacher", category: "people" },

    // Nature
    { telugu: "నీరు", english: "water", category: "nature" },
    { telugu: "నిప్పు", english: "fire", category: "nature" },
    { telugu: "గాలి", english: "wind", category: "nature" },
    { telugu: "ఆకాశం", english: "sky", category: "nature" },
    { telugu: "సూర్యుడు", english: "sun", category: "nature" },
    { telugu: "చంద్రుడు", english: "moon", category: "nature" },
    { telugu: "నక్షత్రం", english: "star", category: "nature" },
    { telugu: "నది", english: "river", category: "nature" },
    { telugu: "కొండ", english: "hill", category: "nature" },
    { telugu: "చెట్టు", english: "tree", category: "nature" },
    { telugu: "పువ్వు", english: "flower", category: "nature" },
    { telugu: "వాన", english: "rain", category: "nature" },
    { telugu: "మేఘం", english: "cloud", category: "nature" },

    // Animals
    { telugu: "కుక్క", english: "dog", category: "animals" },
    { telugu: "పిల్లి", english: "cat", category: "animals" },
    { telugu: "ఆవు", english: "cow", category: "animals" },
    { telugu: "గుర్రం", english: "horse", category: "animals" },
    { telugu: "ఏనుగు", english: "elephant", category: "animals" },
    { telugu: "పులి", english: "tiger", category: "animals" },
    { telugu: "సింహం", english: "lion", category: "animals" },
    { telugu: "చేప", english: "fish", category: "animals" },
    { telugu: "పక్షి", english: "bird", category: "animals" },
    { telugu: "కోతి", english: "monkey", category: "animals" },

    // Food
    { telugu: "అన్నం", english: "rice / food", category: "food" },
    { telugu: "పాలు", english: "milk", category: "food" },
    { telugu: "పండు", english: "fruit", category: "food" },
    { telugu: "మామిడి", english: "mango", category: "food" },
    { telugu: "అరటి", english: "banana", category: "food" },
    { telugu: "ఉప్పు", english: "salt", category: "food" },
    { telugu: "చక్కెర", english: "sugar", category: "food" },
    { telugu: "కూర", english: "curry / vegetable", category: "food" },
    { telugu: "రొట్టె", english: "bread", category: "food" },
    { telugu: "నూనె", english: "oil", category: "food" },

    // Home & objects
    { telugu: "ఇల్లు", english: "house", category: "objects" },
    { telugu: "తలుపు", english: "door", category: "objects" },
    { telugu: "కిటికీ", english: "window", category: "objects" },
    { telugu: "పుస్తకం", english: "book", category: "objects" },
    { telugu: "కలం", english: "pen", category: "objects" },
    { telugu: "బల్ల", english: "table", category: "objects" },
    { telugu: "కుర్చీ", english: "chair", category: "objects" },
    { telugu: "దీపం", english: "lamp", category: "objects" },
    { telugu: "బట్ట", english: "cloth", category: "objects" },
    { telugu: "డబ్బు", english: "money", category: "objects" },
    { telugu: "బడి", english: "school", category: "objects" },
    { telugu: "బండి", english: "vehicle / cart", category: "objects" },

    // Body
    { telugu: "తల", english: "head", category: "body" },
    { telugu: "కన్ను", english: "eye", category: "body" },
    { telugu: "చెవి", english: "ear", category: "body" },
    { telugu: "ముక్కు", english: "nose", category: "body" },
    { telugu: "నోరు", english: "mouth", category: "body" },
    { telugu: "చేయి", english: "hand", category: "body" },
    { telugu: "కాలు", english: "leg / foot", category: "body" },

    // Colors
    { telugu: "ఎరుపు", english: "red", category: "colors" },
    { telugu: "నలుపు", english: "black", category: "colors" },
    { telugu: "తెలుపు", english: "white", category: "colors" },
    { telugu: "పసుపు", english: "yellow", category: "colors" },
    { telugu: "పచ్చ", english: "green", category: "colors" },

    // Numbers
    { telugu: "ఒకటి", english: "one", category: "numbers" },
    { telugu: "రెండు", english: "two", category: "numbers" },
    { telugu: "మూడు", english: "three", category: "numbers" },
    { telugu: "నాలుగు", english: "four", category: "numbers" },
    { telugu: "ఐదు", english: "five", category: "numbers" },
    { telugu: "ఆరు", english: "six", category: "numbers" },
    { telugu: "ఏడు", english: "seven", category: "numbers" },
    { telugu: "ఎనిమిది", english: "eight", category: "numbers" },
    { telugu: "తొమ్మిది", english: "nine", category: "numbers" },
    { telugu: "పది", english: "ten", category: "numbers" },

    // Common verbs (root/infinitive-ish dictionary forms)
    { telugu: "తినడం", english: "to eat", category: "verbs" },
    { telugu: "తాగడం", english: "to drink", category: "verbs" },
    { telugu: "చదవడం", english: "to read", category: "verbs" },
    { telugu: "రాయడం", english: "to write", category: "verbs" },
    { telugu: "వెళ్ళడం", english: "to go", category: "verbs" },
    { telugu: "రావడం", english: "to come", category: "verbs" },
    { telugu: "చూడడం", english: "to see", category: "verbs" },
    { telugu: "మాట్లాడడం", english: "to speak", category: "verbs" },

    // Adjectives & common words
    { telugu: "మంచి", english: "good", category: "adjectives" },
    { telugu: "చెడు", english: "bad", category: "adjectives" },
    { telugu: "పెద్ద", english: "big", category: "adjectives" },
    { telugu: "చిన్న", english: "small", category: "adjectives" },
    { telugu: "కొత్త", english: "new", category: "adjectives" },
    { telugu: "పాత", english: "old", category: "adjectives" },
    { telugu: "వేడి", english: "hot", category: "adjectives" },
    { telugu: "చల్ల", english: "cold", category: "adjectives" },

    // More people & family
    { telugu: "తాత", english: "grandfather", category: "people" },
    { telugu: "అమ్మమ్మ", english: "grandmother (maternal)", category: "people" },
    { telugu: "నానమ్మ", english: "grandmother (paternal)", category: "people" },
    { telugu: "మామయ్య", english: "uncle (maternal)", category: "people" },
    { telugu: "అత్త", english: "aunt", category: "people" },
    { telugu: "భార్య", english: "wife", category: "people" },
    { telugu: "భర్త", english: "husband", category: "people" },
    { telugu: "కుమారుడు", english: "son", category: "people" },
    { telugu: "కుమార్తె", english: "daughter", category: "people" },
    { telugu: "వైద్యుడు", english: "doctor", category: "people" },
    { telugu: "రైతు", english: "farmer", category: "people" },

    // More nature
    { telugu: "భూమి", english: "earth / land", category: "nature" },
    { telugu: "సముద్రం", english: "sea", category: "nature" },
    { telugu: "అడవి", english: "forest", category: "nature" },
    { telugu: "ఆకు", english: "leaf", category: "nature" },
    { telugu: "విత్తనం", english: "seed", category: "nature" },
    { telugu: "మంచు", english: "snow / dew", category: "nature" },
    { telugu: "రాయి", english: "stone", category: "nature" },
    { telugu: "ఇసుక", english: "sand", category: "nature" },
    { telugu: "మట్టి", english: "soil", category: "nature" },

    // More animals
    { telugu: "మేక", english: "goat", category: "animals" },
    { telugu: "గొర్రె", english: "sheep", category: "animals" },
    { telugu: "ఎలుగుబంటి", english: "bear", category: "animals" },
    { telugu: "నక్క", english: "fox", category: "animals" },
    { telugu: "పాము", english: "snake", category: "animals" },
    { telugu: "కప్ప", english: "frog", category: "animals" },
    { telugu: "తాబేలు", english: "tortoise", category: "animals" },
    { telugu: "సీతాకోకచిలుక", english: "butterfly", category: "animals" },
    { telugu: "చీమ", english: "ant", category: "animals" },

    // More food
    { telugu: "నీళ్ళు", english: "water (plural)", category: "food" },
    { telugu: "పెరుగు", english: "curd / yogurt", category: "food" },
    { telugu: "నెయ్యి", english: "ghee", category: "food" },
    { telugu: "కూరగాయలు", english: "vegetables", category: "food" },
    { telugu: "ఉల్లిపాయ", english: "onion", category: "food" },
    { telugu: "బంగాళాదుంప", english: "potato", category: "food" },
    { telugu: "మిరపకాయ", english: "chilli", category: "food" },
    { telugu: "కాఫీ", english: "coffee", category: "food" },
    { telugu: "టీ", english: "tea", category: "food" },
    { telugu: "గుడ్డు", english: "egg", category: "food" },

    // More objects
    { telugu: "గడియారం", english: "clock", category: "objects" },
    { telugu: "తాళం", english: "lock / key", category: "objects" },
    { telugu: "బుట్ట", english: "basket", category: "objects" },
    { telugu: "గొడుగు", english: "umbrella", category: "objects" },
    { telugu: "చీపురు", english: "broom", category: "objects" },
    { telugu: "అద్దం", english: "mirror", category: "objects" },
    { telugu: "సంచి", english: "bag", category: "objects" },
    { telugu: "కత్తి", english: "knife", category: "objects" },
    { telugu: "ఫోన్", english: "phone", category: "objects" },

    // Body
    { telugu: "పన్ను", english: "tooth", category: "body" },
    { telugu: "నాలుక", english: "tongue", category: "body" },
    { telugu: "వేలు", english: "finger", category: "body" },
    { telugu: "గుండె", english: "heart", category: "body" },
    { telugu: "జుట్టు", english: "hair", category: "body" },

    // More colors
    { telugu: "నీలం", english: "blue", category: "colors" },
    { telugu: "గోధుమ", english: "brown", category: "colors" },
    { telugu: "నారింజ", english: "orange", category: "colors" },

    // Time & days
    { telugu: "రోజు", english: "day", category: "time" },
    { telugu: "రాత్రి", english: "night", category: "time" },
    { telugu: "ఉదయం", english: "morning", category: "time" },
    { telugu: "సాయంత్రం", english: "evening", category: "time" },
    { telugu: "నేడు", english: "today", category: "time" },
    { telugu: "రేపు", english: "tomorrow", category: "time" },
    { telugu: "నిన్న", english: "yesterday", category: "time" },
    { telugu: "వారం", english: "week", category: "time" },
    { telugu: "నెల", english: "month", category: "time" },
    { telugu: "సంవత్సరం", english: "year", category: "time" },

    // More numbers
    { telugu: "పదకొండు", english: "eleven", category: "numbers" },
    { telugu: "ఇరవై", english: "twenty", category: "numbers" },
    { telugu: "వంద", english: "hundred", category: "numbers" },
    { telugu: "వెయ్యి", english: "thousand", category: "numbers" },

    // More verbs
    { telugu: "నడవడం", english: "to walk", category: "verbs" },
    { telugu: "పరుగెత్తడం", english: "to run", category: "verbs" },
    { telugu: "నిద్రపోవడం", english: "to sleep", category: "verbs" },
    { telugu: "ఆడడం", english: "to play", category: "verbs" },
    { telugu: "పాడడం", english: "to sing", category: "verbs" },
    { telugu: "వినడం", english: "to listen", category: "verbs" },
    { telugu: "నేర్చుకోవడం", english: "to learn", category: "verbs" },
    { telugu: "ఇవ్వడం", english: "to give", category: "verbs" },
    { telugu: "తీసుకోవడం", english: "to take", category: "verbs" },
    { telugu: "కొనడం", english: "to buy", category: "verbs" },

    // More adjectives
    { telugu: "పొడవు", english: "long / tall", category: "adjectives" },
    { telugu: "పొట్టి", english: "short", category: "adjectives" },
    { telugu: "అందమైన", english: "beautiful", category: "adjectives" },
    { telugu: "వేగంగా", english: "fast", category: "adjectives" },
    { telugu: "నెమ్మదిగా", english: "slow", category: "adjectives" },
    { telugu: "సులభం", english: "easy", category: "adjectives" },
    { telugu: "కష్టం", english: "difficult", category: "adjectives" },

    // Common / function words
    { telugu: "అవును", english: "yes", category: "common" },
    { telugu: "కాదు", english: "no / not", category: "common" },
    { telugu: "ఇక్కడ", english: "here", category: "common" },
    { telugu: "అక్కడ", english: "there", category: "common" },
    { telugu: "ఇప్పుడు", english: "now", category: "common" },
    { telugu: "ఎక్కడ", english: "where", category: "common" },
    { telugu: "ఎప్పుడు", english: "when", category: "common" },
    { telugu: "ఎందుకు", english: "why", category: "common" },
    { telugu: "ఎవరు", english: "who", category: "common" },
    { telugu: "ఏమిటి", english: "what", category: "common" },
];
