import { PageHeader } from "@/components/PageHeader";
import { QuizTabs } from "@/components/QuizTabs";
import { VOWEL_CARDS, CONSONANT_CARDS, ALL_COMBINATIONS } from "@/data/alphabet";

export const metadata = { title: "Alphabet quiz — Leepi" };

const POOL = [...VOWEL_CARDS, ...CONSONANT_CARDS, ...ALL_COMBINATIONS];

export default function AlphabetQuizPage() {
    return (
        <div>
            <PageHeader
                title="Alphabet quiz"
                subtitle="Read each letter and pick its sound — romanization stays hidden."
                action={{ href: "/alphabet", label: "← Back to cards" }}
            />
            <QuizTabs
                pool={POOL}
                section="alphabet"
                availableModes={["te-to-roman", "roman-to-te", "audio-to-te"]}
                setupTitle="Letters & syllables practice"
            />
        </div>
    );
}
