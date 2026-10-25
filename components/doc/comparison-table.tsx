/** Tables scroll inside their own frame so the page never scrolls sideways. */
export function ComparisonTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label="Comparison table (scrolls horizontally)">
      <table className="min-w-full">{children}</table>
    </div>
  );
}
