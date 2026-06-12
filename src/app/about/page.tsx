import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "About — Leepi" };

export default function AboutPage() {
  return (
    <div className="prose-sm max-w-2xl">
      <PageHeader title="About & attribution" />

      <div className="space-y-4 text-sm leading-relaxed text-muted">
        <p>
          <strong className="text-foreground">Leepi</strong> is a study aid focused on
          learning to <em>read</em> written Telugu. It progresses from the alphabet to words to
          sentences, with flashcards, quizzes, pronunciation audio and locally-saved progress.
        </p>

        <h2 className="text-base font-semibold text-foreground">Romanization</h2>
        <p>
          Two romanization styles are supported and can be switched in Settings: a learner-friendly
          phonetic spelling and academic ISO 15919. Romanization is hidden by default in cards and
          quizzes because reading the Telugu script — not the romanization — is the skill being
          practised.
        </p>

        <h2 className="text-base font-semibold text-foreground">Data sources</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-foreground">Alphabet:</strong> hand-curated tables of vowels,
            consonants, vowel signs and common combinations.
          </li>
          <li>
            <strong className="text-foreground">Words:</strong> a curated beginner vocabulary list
            with English meanings.
          </li>
          <li>
            <strong className="text-foreground">Sentences:</strong> curated examples plus
            Telugu↔English pairs from{" "}
            <a className="underline hover:text-accent" href="https://tatoeba.org" target="_blank" rel="noreferrer">
              Tatoeba
            </a>
            , licensed under{" "}
            <a
              className="underline hover:text-accent"
              href="https://creativecommons.org/licenses/by/2.0/fr/"
              target="_blank"
              rel="noreferrer"
            >
              CC BY 2.0 FR
            </a>
            .
          </li>
        </ul>
        <p>
          Romanizations are generated with the{" "}
          <a
            className="underline hover:text-accent"
            href="https://github.com/indic-transliteration/sanscript.js"
            target="_blank"
            rel="noreferrer"
          >
            @indic-transliteration/sanscript
          </a>{" "}
          library and are approximate.
        </p>

        <h2 className="text-base font-semibold text-foreground">Privacy</h2>
        <p>
          All progress (mastery, quiz scores and streaks) and settings are stored only in your
          browser&apos;s localStorage. Nothing is sent to a server.
        </p>
      </div>
    </div>
  );
}
