import mongoose from "mongoose";
import Course from "../models/Course.js";

// POST /api/courses/:courseId/enroll
export const enrollStudent = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user && (req.user.id || req.user._id);

  // Validate courseId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Make sure userId is available
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Already enrolled?
    const already = course.enrolledStudents.some(
      (s) => s.toString() === userId.toString()
    );
    if (already) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.enrolledStudents.push(userId);
    await course.save();

    res.status(200).json({ message: "Enrolled successfully", courseId, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export default enrollStudent;
