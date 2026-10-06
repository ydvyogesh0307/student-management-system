import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export const getStudents = (params) => api.get("/students", { params }).then((r) => r.data);
export const getCourses = () => api.get("/students/meta/courses").then((r) => r.data);
export const createStudent = (body) => api.post("/students", body).then((r) => r.data);
export const updateStudent = (id, body) => api.put(`/students/${id}`, body).then((r) => r.data);
export const deleteStudent = (id) => api.delete(`/students/${id}`).then((r) => r.data);

export const getErrorMessage = (err) =>
  err.response?.data?.message ||
  (err.request ? "Cannot reach the server. Check that the API is running." : err.message);
