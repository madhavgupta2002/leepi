"use client";

import { useState } from "react";
import type { CuratedQuiz, Section } from "@/lib/types";
import { QuizRunner } from "@/components/QuizRunner";

export function CuratedQuizList({ quizzes, section }: { quizzes: CuratedQuiz[]; section: Section }) {
  const [active, setActive] = useState<CuratedQuiz | null>(null);

  if (active) {
    return (
      <QuizRunner
        questions={active.questions}
        section={section}
        modeLabel={`Curated · ${active.title}`}
        onExit={() => setActive(null)}
      />
    );
  }

  if (quizzes.length === 0) return null;

  return (
    <div className="space-y-3">
      {quizzes.map((qz) => (
        <button
          key={qz.id}
          onClick={() => setActive(qz)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition hover:border-accent hover:bg-accent/5"
        >
          <span>
            <span className="font-semibold">{qz.title}</span>
            <span className="block text-sm text-muted">{qz.description}</span>
          </span>
          <span className="ml-3 shrink-0 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
            {qz.questions.length} Q
          </span>
        </button>
      ))}
    </div>
  );
}
