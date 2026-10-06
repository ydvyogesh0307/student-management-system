const pageWindow = (page, totalPages) => {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("gap-" + p);
    out.push(p);
  });
  return out;
};

export default function Pagination({ page, totalPages, total, limit, onPage, onLimit }) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted">
        Showing {from}–{to} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-muted">
          Rows
          <select className="field w-auto py-1" value={limit} onChange={(e) => onLimit(Number(e.target.value))}>
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button type="button" className="btn-ghost px-3 py-1" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Previous
          </button>
          {pageWindow(page, totalPages).map((p) =>
            typeof p === "string" ? (
              <span key={p} className="px-1 text-muted">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === page ? "page" : undefined}
                className={`h-8 min-w-8 rounded-md px-2 font-semibold ${
                  p === page ? "bg-accent text-white" : "hover:bg-canvas"
                }`}
                onClick={() => onPage(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            className="btn-ghost px-3 py-1"
            disabled={page >= totalPages}
            onClick={() => onPage(page + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
