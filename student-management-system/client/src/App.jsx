import { useCallback, useEffect, useState } from "react";
import {
  getStudents,
  getCourses,
  createStudent,
  updateStudent,
  deleteStudent,
  getErrorMessage,
} from "./api/studentApi";
import useDebounce from "./hooks/useDebounce";
import Filters from "./components/Filters";
import StudentTable from "./components/StudentTable";
import Pagination from "./components/Pagination";
import StudentForm from "./components/StudentForm";

const initialFilters = { search: "", course: "", year: "", status: "" };

export default function App() {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const search = useDebounce(filters.search, 400);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getStudents({
        search: search || undefined,
        course: filters.course || undefined,
        year: filters.year || undefined,
        status: filters.status || undefined,
        page,
        limit,
      });
      if (res.data.length === 0 && page > 1) {
        setPage(page - 1); // last item on this page was removed
        return;
      }
      setStudents(res.data);
      setMeta({ total: res.total, totalPages: res.totalPages });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, filters.course, filters.year, filters.status, page, limit]);

  const loadCourses = useCallback(() => {
    getCourses().then(setCourses).catch(() => {});
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const changeFilters = (next) => {
    setFilters(next);
    setPage(1);
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const handleSubmit = async (values) => {
    if (editing) {
      await updateStudent(editing._id, values);
      setToast("Student updated");
    } else {
      await createStudent(values);
      setToast("Student added");
    }
    setFormOpen(false);
    loadStudents();
    loadCourses();
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name}? This cannot be undone.`)) return;
    try {
      await deleteStudent(student._id);
      setToast("Student deleted");
      loadStudents();
      loadCourses();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Students</h1>
          <p className="mt-1 text-sm text-muted">{meta.total} records in the current view</p>
        </div>
        <button type="button" className="btn-primary" onClick={openAdd}>
          Add student
        </button>
      </header>

      <section className="mt-6">
        <Filters
          filters={filters}
          courses={courses}
          onChange={changeFilters}
          onClear={() => changeFilters(initialFilters)}
        />
      </section>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <section className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        <StudentTable
          students={students}
          loading={loading}
          hasFilters={hasFilters}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={limit}
          onPage={setPage}
          onLimit={(n) => {
            setLimit(n);
            setPage(1);
          }}
        />
      </section>

      {formOpen && <StudentForm student={editing} onSubmit={handleSubmit} onClose={closeForm} />}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
