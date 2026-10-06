import { Router } from "express";
import {
  getStudents,
  getCourses,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = Router();

router.route("/").get(getStudents).post(createStudent);
router.get("/meta/courses", getCourses); // must stay above "/:id"
router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

export default router;
