import mongoose from "mongoose";
import Course from "../models/Course.js";

// Add a lesson to a course
export const addLesson = async (req, res) => {
  const { courseId } = req.params;
  const { title, content, videoUrl, duration } = req.body;

  // ✅ Validate courseId before querying
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const newLesson = { title, content, videoUrl, duration };
    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({ message: "Lesson added", lesson: newLesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all lessons in a course
export const getLessons = async (req, res) => {
  const { courseId } = req.params;

  // ✅ Validate courseId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course.lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create aliases and additional helpers expected by routes
export const createLesson = addLesson;
export const getLessonsByCourse = getLessons;

// Get a specific lesson by id within a course
export const getLessonById = async (req, res) => {
  const { courseId, lessonId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    return res.status(400).json({ message: "Invalid lesson ID" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = course.lessons.id
      ? course.lessons.id(lessonId)
      : course.lessons.find((l) => l._id && l._id.toString() === lessonId);

    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
