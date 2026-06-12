import { PageHeader } from "@/components/PageHeader";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export const metadata = { title: "Progress — Leepi" };

export default function ProgressPage() {
    return (
        <div>
            <PageHeader title="Your progress" subtitle="Saved locally in this browser." />
            <ProgressDashboard />
        </div>
    );
}
