import { PageHeader } from "@/components/PageHeader";
import { AlphabetExplorer } from "@/components/AlphabetExplorer";

export const metadata = { title: "Alphabet — Leepi" };

export default function AlphabetPage() {
    return (
        <div>
            <PageHeader
                title="Telugu alphabet"
                subtitle="Learn vowels, consonants, vowel signs and combinations."
                action={{ href: "/alphabet/quiz", label: "Take a quiz →" }}
            />
            <AlphabetExplorer />
        </div>
    );
}
