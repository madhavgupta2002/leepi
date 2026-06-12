export function ProgressBar({
    value,
    label,
    className = "",
}: {
    value: number; // 0..1
    label?: string;
    className?: string;
}) {
    const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
    return (
        <div className={className}>
            {label && (
                <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>{label}</span>
                    <span>{pct}%</span>
                </div>
            )}
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
