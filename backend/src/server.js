import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import masterRoutes from "./routes/masterRoutes.js";
import examFormRoutes from "./routes/examFormRoutes.js";
import examPlanRoutes from "./routes/examPlanRoutes.js";
import { protect, authorize } from "./middleware/auth.js";
import { ExamForm } from "./models/ExamForm.js";
import { Course } from "./models/Course.js";
import { Subject } from "./models/Subject.js";
import { Classroom } from "./models/Classroom.js";
import { Faculty } from "./models/Faculty.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/forms", examFormRoutes);
app.use("/api/plans", examPlanRoutes);

app.get("/api/admin/analytics", protect, authorize("admin"), async (_req, res) => {
  const [forms, submitted, approved, courses, subjects, classrooms, faculty] = await Promise.all([
    ExamForm.countDocuments(),
    ExamForm.countDocuments({ status: "submitted" }),
    ExamForm.countDocuments({ status: "approved" }),
    Course.countDocuments(),
    Subject.countDocuments(),
    Classroom.countDocuments(),
    Faculty.countDocuments()
  ]);

  return res.json({ forms, submitted, approved, courses, subjects, classrooms, faculty });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
