import express from "express";
import {
  createLesson,
  getLessonById,
  getLessonsByCourse,
} from "../controllers/lesson.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { checkEnrollment } from "../middleware/enrollmentMiddleware.js";

const router = express.Router();

// ✅ Create a lesson (Instructor only)
router.post(
  "/:courseId",
  protect,
  restrictTo("instructor"),   // Only instructors
  createLesson
);

// ✅ Get a specific lesson (Instructor or enrolled student)
router.get(
  "/:courseId/:lessonId",
  protect,
  checkEnrollment,
  getLessonById
);

// ✅ Get all lessons for a course (Instructor or enrolled student)
router.get(
  "/:courseId",
  protect,
  checkEnrollment,
  getLessonsByCourse
);

export default router;
