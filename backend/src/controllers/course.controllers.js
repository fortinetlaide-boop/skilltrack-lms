import Course from "../models/Course.js";

// POST /api/courses/:courseId/enroll
export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // 1️⃣ Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Prevent instructors from enrolling
    if (req.user.role === "instructor") {
      return res
        .status(403)
        .json({ message: "Instructors cannot enroll in courses" });
    }

    // 3️⃣ Prevent duplicate enrollment
    if (course.enrolledStudents.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    // 4️⃣ Add student to enrolledStudents
    course.enrolledStudents.push(userId);
    await course.save();

    res.status(200).json({
      message: "Enrollment successful",
      courseId: course._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
