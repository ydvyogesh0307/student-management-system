export default function Filters({ filters, courses, onChange, onClear }) {
  const hasFilters = Object.values(filters).some(Boolean);

  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input
        type="search"
        className="field"
        placeholder="Search by name, email or roll number"
        aria-label="Search students"
        value={filters.search}
        onChange={set("search")}
      />
      <select className="field" aria-label="Filter by course" value={filters.course} onChange={set("course")}>
        <option value="">All courses</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select className="field" aria-label="Filter by year" value={filters.year} onChange={set("year")}>
        <option value="">All years</option>
        {[1, 2, 3, 4].map((y) => (
          <option key={y} value={y}>
            Year {y}
          </option>
        ))}
      </select>
      <select className="field" aria-label="Filter by status" value={filters.status} onChange={set("status")}>
        <option value="">Any status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button type="button" className="btn-ghost" onClick={onClear} disabled={!hasFilters}>
        Clear filters
      </button>
    </div>
  );
}
