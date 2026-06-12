import { PageHeader } from "@/components/PageHeader";
import { QuizTabs } from "@/components/QuizTabs";
import { WORD_CARDS } from "@/lib/corpus";

export const metadata = { title: "Words quiz — Leepi" };

export default function WordsQuizPage() {
  return (
    <div>
      <PageHeader
        title="Words quiz"
        subtitle="Match Telugu words to their sound and meaning."
        action={{ href: "/words", label: "← Back to cards" }}
      />
      <QuizTabs
        pool={WORD_CARDS}
        section="words"
        availableModes={["te-to-en", "en-to-te", "te-to-roman", "roman-to-te", "audio-to-te"]}
        setupTitle="Vocabulary practice"
      />
    </div>
  );
}
