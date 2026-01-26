import express from "express";
import { enrollStudent } from "../controllers/courseController.js";
import { protect } from "../middleware/auth.middleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// POST /api/courses/:courseId/enroll
router.post(
  "/:courseId/enroll",
  protect,                 // ✅ Must be logged in
  restrictTo("student"),   // ✅ Only students
  enrollStudent
);

export default router;
