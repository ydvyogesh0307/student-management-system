const statusStyles = {
  Active: "bg-accent-soft text-accent-dark",
  Inactive: "bg-gray-200 text-muted",
};

export default function StudentTable({ students, loading, hasFilters, onEdit, onDelete }) {
  if (!loading && students.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="font-semibold">
          {hasFilters ? "No students match these filters" : "No students yet"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasFilters
            ? "Try a different search or clear the filters."
            : "Select Add student to create the first record."}
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${loading ? "opacity-60" : ""}`}>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line bg-canvas/60 text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Roll no.</th>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium">Year</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {students.map((s) => (
            <tr key={s._id} className="hover:bg-canvas/50">
              <td className="whitespace-nowrap px-4 py-3 font-medium">{s.rollNumber}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{s.name}</div>
                <div className="text-muted">{s.email}</div>
              </td>
              <td className="px-4 py-3">{s.course}</td>
              <td className="px-4 py-3">{s.year}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[s.status]}`}>
                  {s.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  type="button"
                  className="mr-2 rounded px-2 py-1 font-semibold text-accent-dark hover:bg-accent-soft"
                  onClick={() => onEdit(s)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded px-2 py-1 font-semibold text-danger hover:bg-danger-soft"
                  onClick={() => onDelete(s)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
