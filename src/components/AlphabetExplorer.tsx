"use client";

import { useState } from "react";
import {
  VOWEL_CARDS,
  CONSONANT_CARDS,
  CONSONANTS,
  MATRAS,
  MODIFIERS,
  CONJUNCTS,
  gunintamFor,
} from "@/data/alphabet";
import { CardBrowser } from "@/components/CardBrowser";
import { Flashcard } from "@/components/Flashcard";

const TABS = ["Vowels", "Consonants", "Combinations", "Vowel signs", "Special"] as const;
type Tab = (typeof TABS)[number];

export function AlphabetExplorer() {
  const [tab, setTab] = useState<Tab>("Vowels");

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              tab === t ? "bg-accent text-white" : "border border-border hover:bg-accent/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Vowels" && (
        <>
          <SectionNote>
            <strong>అచ్చులు (achchulu)</strong> — vowels stand alone at the start of a word.
          </SectionNote>
          <CardBrowser cards={VOWEL_CARDS} categories={[]} />
        </>
      )}

      {tab === "Consonants" && (
        <>
          <SectionNote>
            <strong>హల్లులు (hallulu)</strong> — each consonant already carries an inherent
            “a” sound (క = “ka”).
          </SectionNote>
          <CardBrowser cards={CONSONANT_CARDS} categories={[]} />
        </>
      )}

      {tab === "Combinations" && <Combinations />}

      {tab === "Vowel signs" && <MatraTable />}

      {tab === "Special" && (
        <>
          <SectionNote>
            Modifiers change a sound; conjuncts (ottulu) join two consonants.
          </SectionNote>
          <h3 className="mb-2 mt-2 text-sm font-semibold">Modifiers</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {MODIFIERS.map((c) => (
              <Flashcard key={c.id} card={c} />
            ))}
          </div>
          <h3 className="mb-2 mt-5 text-sm font-semibold">Conjuncts (ottulu)</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CONJUNCTS.map((c) => (
              <Flashcard key={c.id} card={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Combinations() {
  const [consonantId, setConsonantId] = useState(CONSONANTS[0].id);
  const combos = gunintamFor(consonantId);

  return (
    <div>
      <SectionNote>
        <strong>గుణింతం (gunintam)</strong> — a consonant combined with each vowel sign. Pick a
        consonant to see its full set.
      </SectionNote>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CONSONANTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setConsonantId(c.id)}
            className={`telugu rounded-lg px-3 py-1 text-lg transition ${
              consonantId === c.id ? "bg-accent text-white" : "border border-border hover:bg-accent/10"
            }`}
          >
            {c.telugu}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {combos.map((c) => (
          <Flashcard key={c.id} card={c} />
        ))}
      </div>
    </div>
  );
}

function MatraTable() {
  return (
    <div>
      <SectionNote>
        Vowel signs (matras) attach to a consonant to change its vowel. The first row is the
        inherent “a”.
      </SectionNote>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2">Vowel</th>
              <th className="px-4 py-2">Sign</th>
              <th className="px-4 py-2">Example (with క)</th>
              <th className="px-4 py-2">Reads as</th>
            </tr>
          </thead>
          <tbody>
            {MATRAS.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="telugu px-4 py-2 text-xl">{m.baseVowel}</td>
                <td className="telugu px-4 py-2 text-xl">{m.sign}</td>
                <td className="telugu px-4 py-2 text-xl">
                  {"క" + (m.sign.startsWith("(") ? "" : m.sign)}
                </td>
                <td className="px-4 py-2 text-amber-700 dark:text-amber-300">k{m.phonetic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted">
      {children}
    </p>
  );
}
