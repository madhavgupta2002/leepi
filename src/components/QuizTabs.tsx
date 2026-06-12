"use client";

import { useState } from "react";
import type { Card, QuizMode, Section } from "@/lib/types";
import { QuizSetup } from "@/components/QuizSetup";
import { CuratedQuizList } from "@/components/CuratedQuizList";
import { curatedForSection } from "@/data/curated-quizzes";

export function QuizTabs({
  pool,
  section,
  availableModes,
  setupTitle,
}: {
  pool: Card[];
  section: Section;
  availableModes: QuizMode[];
  setupTitle: string;
}) {
  const [tab, setTab] = useState<"generated" | "curated">("generated");
  const curated = curatedForSection(section);

  return (
    <div>
      <div className="mb-5 inline-flex rounded-lg border border-border p-1">
        <TabButton active={tab === "generated"} onClick={() => setTab("generated")}>
          Practice quiz
        </TabButton>
        <TabButton active={tab === "curated"} onClick={() => setTab("curated")}>
          Reading challenges ({curated.reduce((n, q) => n + q.questions.length, 0)})
        </TabButton>
      </div>

      {tab === "generated" ? (
        <QuizSetup pool={pool} section={section} availableModes={availableModes} title={setupTitle} />
      ) : curated.length ? (
        <CuratedQuizList quizzes={curated} section={section} />
      ) : (
        <p className="text-muted">No reading challenges for this section yet.</p>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active ? "bg-accent text-white" : "hover:bg-accent/10"
      }`}
    >
      {children}
    </button>
  );
}
