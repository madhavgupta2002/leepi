// Transliteration helpers shared by the build-time data scripts and (optionally)
// runtime. Romanizations for the bundled corpus are precomputed at build time so
// the browser bundle does not need the transliteration library.
import Sanscript from "@indic-transliteration/sanscript";

/** Convert a Telugu string to ISO 15919 romanization. */
export function teluguToIso(text: string): string {
  try {
    return Sanscript.t(text, "telugu", "iso");
  } catch {
    return text;
  }
}

// Ordered list: longer keys first so multi-char sequences are replaced before
// their single-char prefixes (e.g. "ai" before "a").
const ISO_TO_PHONETIC: ReadonlyArray<readonly [string, string]> = [
  ["kṣ", "ksh"],
  ["jñ", "gn"],
  ["ṅ", "ng"],
  ["ñ", "ny"],
  [" kh", " kh"],
  ["ā", "aa"],
  ["ī", "ee"],
  ["ū", "oo"],
  ["ē", "ae"],
  ["ō", "oo"],
  ["ai", "ai"],
  ["au", "au"],
  ["ṛ", "ru"],
  ["ṝ", "ruu"],
  ["ḷ", "lu"],
  ["ṭ", "t"],
  ["ḍ", "d"],
  ["ṇ", "n"],
  ["ś", "sh"],
  ["ṣ", "sh"],
  ["ṁ", "m"],
  ["ṃ", "m"],
  ["ḥ", "h"],
  ["ḻ", "l"],
  ["ṟ", "r"],
];

/**
 * Approximate a learner-friendly phonetic spelling from an ISO 15919 string by
 * mapping diacritic characters to plain ASCII digraphs. This is intentionally a
 * simplification and not academically precise.
 */
export function isoToPhonetic(iso: string): string {
  let out = iso;
  for (const [from, to] of ISO_TO_PHONETIC) {
    out = out.split(from).join(to);
  }
  // Strip any remaining combining diacritics.
  out = out.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return out;
}

/** Convenience: Telugu directly to a learner-friendly phonetic spelling. */
export function teluguToPhonetic(text: string): string {
  return isoToPhonetic(teluguToIso(text));
}
