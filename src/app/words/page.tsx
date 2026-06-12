import { PageHeader } from "@/components/PageHeader";
import { CardBrowser } from "@/components/CardBrowser";
import { WORD_CARDS, WORD_CATEGORIES } from "@/lib/corpus";

export const metadata = { title: "Words — Leepi" };

export default function WordsPage() {
  return (
    <div>
      <PageHeader
        title="Telugu words"
        subtitle="Flip each card for the romanization and English meaning."
        action={{ href: "/words/quiz", label: "Take a quiz →" }}
      />
      <CardBrowser cards={WORD_CARDS} categories={WORD_CATEGORIES} />
    </div>
  );
}
