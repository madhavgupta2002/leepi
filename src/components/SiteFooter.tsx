import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t border-border bg-card/50">
            <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted">
                <p>
                    Leepi — a study aid for reading written Telugu. Progress is saved
                    locally in your browser.
                </p>
                <p className="mt-1">
                    Sentence data from{" "}
                    <a className="underline hover:text-accent" href="https://tatoeba.org" target="_blank" rel="noreferrer">
                        Tatoeba
                    </a>{" "}
                    (CC BY 2.0 FR). See{" "}
                    <Link className="underline hover:text-accent" href="/about">
                        about &amp; attribution
                    </Link>
                    .
                </p>
            </div>
        </footer>
    );
}
