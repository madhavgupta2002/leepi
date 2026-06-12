import { PageHeader } from "@/components/PageHeader";
import { QuizTabs } from "@/components/QuizTabs";
import { SENTENCE_CARDS } from "@/lib/corpus";

export const metadata = { title: "Sentences quiz — Leepi" };

export default function SentencesQuizPage() {
    return (
        <div>
            <PageHeader
                title="Sentences quiz"
                subtitle="Read each sentence and pick the right meaning."
                action={{ href: "/sentences", label: "← Back to sentences" }}
            />
            <QuizTabs
                pool={SENTENCE_CARDS}
                section="sentences"
                availableModes={["te-to-en", "en-to-te", "audio-to-te"]}
                setupTitle="Sentence reading practice"
            />
        </div>
    );
}
