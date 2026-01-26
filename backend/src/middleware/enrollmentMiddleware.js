import Course from "../models/Course.js";

// Middleware to check if user can access a lesson
export const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params; // the course the lesson belongs to
    const userId = req.user._id;

    // 1️⃣ Fetch the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Allow if instructor
    if (course.instructor.toString() === userId.toString()) {
      return next();
    }

    // 3️⃣ Allow if enrolled student
    const isEnrolled = course.enrolledStudents.some(
      (studentId) => studentId.toString() === userId.toString()
    );

    if (isEnrolled) {
      return next();
    }

    // 4️⃣ Otherwise, deny access
    return res.status(403).json({
      message: "Access denied. You are not enrolled in this course",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
