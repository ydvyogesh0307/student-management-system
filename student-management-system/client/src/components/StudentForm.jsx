import { useEffect, useState } from "react";
import { getErrorMessage } from "../api/studentApi";

const empty = { name: "", email: "", rollNumber: "", course: "", year: 1, phone: "", status: "Active" };

export default function StudentForm({ student, onSubmit, onClose }) {
  const [values, setValues] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(student);

  useEffect(() => {
    setValues(student ? { ...empty, ...student } : empty);
    setError("");
  }, [student]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit({ ...values, year: Number(values.year) });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-6 shadow-xl sm:rounded-xl"
      >
        <h2 id="form-title" className="text-lg font-semibold">
          {isEdit ? "Edit student" : "Add student"}
        </h2>

        {error && (
          <p role="alert" className="mt-3 rounded-md bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium sm:col-span-2">
            Full name
            <input className="field mt-1" required value={values.name} onChange={set("name")} />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input className="field mt-1" type="email" required value={values.email} onChange={set("email")} />
          </label>
          <label className="block text-sm font-medium">
            Roll number
            <input className="field mt-1" required value={values.rollNumber} onChange={set("rollNumber")} />
          </label>
          <label className="block text-sm font-medium">
            Course
            <input className="field mt-1" required value={values.course} onChange={set("course")} />
          </label>
          <label className="block text-sm font-medium">
            Year
            <select className="field mt-1" value={values.year} onChange={set("year")}>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Phone
            <input className="field mt-1" value={values.phone || ""} onChange={set("phone")} />
          </label>
          <label className="block text-sm font-medium">
            Status
            <select className="field mt-1" value={values.status} onChange={set("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add student"}
          </button>
        </div>
      </form>
    </div>
  );
}
