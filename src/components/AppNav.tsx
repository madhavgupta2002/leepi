"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { RomajiToggle } from "@/components/RomajiToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/alphabet", label: "Alphabet" },
  { href: "/words", label: "Words" },
  { href: "/sentences", label: "Sentences" },
  { href: "/progress", label: "Progress" },
];

export function AppNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="telugu text-2xl text-accent">లి</span>
          <span className="hidden sm:inline">Leepi</span>
        </Link>

        <nav className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
          {LINKS.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive(l.href) ? "bg-accent/15 text-accent" : "hover:bg-accent/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <RomajiToggle />
        <SettingsPanel />
      </div>
    </header>
  );
}
