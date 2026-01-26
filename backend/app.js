import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import lessonRoutes from "./src/routes/lesson.routes.js";
import courseRoutes from "./src/routes/course.routes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/courses", courseRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({ message: "SkillTrack LMS API is running 🚀" });
});

export default app;
