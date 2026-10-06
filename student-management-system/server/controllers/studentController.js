import mongoose from "mongoose";
import Student from "../models/Student.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const SORTABLE = ["name", "rollNumber", "course", "year", "status", "createdAt"];

const notFoundError = (res) => {
  res.status(404);
  return new Error("Student not found");
};

// GET /api/students?search=&course=&year=&status=&page=1&limit=10&sortBy=createdAt&order=desc
export const getStudents = asyncHandler(async (req, res) => {
  const { search, course, year, status } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const sortBy = SORTABLE.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  const filter = {};
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: rx }, { email: rx }, { rollNumber: rx }];
  }
  if (course) filter.course = course;
  if (year) filter.year = Number(year);
  if (status) filter.status = status;

  const [data, total] = await Promise.all([
    Student.find(filter)
      .sort({ [sortBy]: order, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  res.json({
    data,
    page,
    limit,
    total,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  });
});

// GET /api/students/meta/courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Student.distinct("course");
  res.json(courses.sort());
});

// GET /api/students/:id
export const getStudent = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw notFoundError(res);
  const student = await Student.findById(req.params.id);
  if (!student) throw notFoundError(res);
  res.json(student);
});

// POST /api/students
export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, rollNumber, course, year, phone, status } = req.body;
  const student = await Student.create({ name, email, rollNumber, course, year, phone, status });
  res.status(201).json(student);
});

// PUT /api/students/:id
export const updateStudent = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw notFoundError(res);
  const { name, email, rollNumber, course, year, phone, status } = req.body;
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { name, email, rollNumber, course, year, phone, status },
    { new: true, runValidators: true, omitUndefined: true }
  );
  if (!student) throw notFoundError(res);
  res.json(student);
});

// DELETE /api/students/:id
export const deleteStudent = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw notFoundError(res);
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) throw notFoundError(res);
  res.json({ message: "Student deleted", id: student._id });
});
