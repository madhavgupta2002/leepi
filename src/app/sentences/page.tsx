import { PageHeader } from "@/components/PageHeader";
import { SentenceList } from "@/components/SentenceList";
import { SENTENCE_CARDS } from "@/lib/corpus";

export const metadata = { title: "Sentences — Leepi" };

export default function SentencesPage() {
    return (
        <div>
            <PageHeader
                title="Telugu sentences"
                subtitle="Read full sentences. English is shown; tap to reveal romanization."
                action={{ href: "/sentences/quiz", label: "Take a quiz →" }}
            />
            <SentenceList cards={SENTENCE_CARDS} />
        </div>
    );
}
