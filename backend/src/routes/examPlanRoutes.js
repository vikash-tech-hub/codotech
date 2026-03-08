import express from "express";
import path from "path";
import { protect, authorize } from "../middleware/auth.js";
import { ExamPlan } from "../models/ExamPlan.js";
import { Course } from "../models/Course.js";
import { Semester } from "../models/Semester.js";
import { buildExamPlan } from "../services/examPlanService.js";
import { generatePlanPdf } from "../utils/pdfGenerator.js";

const router = express.Router();

router.post("/generate", protect, authorize("admin"), async (req, res) => {
  try {
    const { courseId, semesterId } = req.body;
    const [course, semester] = await Promise.all([
      Course.findById(courseId),
      Semester.findById(semesterId)
    ]);

    if (!course || !semester) return res.status(400).json({ message: "Invalid course/semester" });

    const generated = await buildExamPlan({ courseId, semesterId });
    const pdfPath = await generatePlanPdf({
      courseName: course.courseName,
      semesterNumber: semester.semesterNumber,
      ...generated
    });

    const plan = await ExamPlan.create({
      course: courseId,
      semester: semesterId,
      dateSheet: generated.dateSheet,
      seatingArrangement: generated.seatingArrangement,
      roomAllocation: generated.roomAllocation,
      invigilators: generated.invigilators,
      pdfPath
    });

    return res.status(201).json(plan);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/latest", protect, async (req, res) => {
  const { courseId, semesterId } = req.query;
  const plan = await ExamPlan.findOne({ course: courseId, semester: semesterId })
    .populate("dateSheet.subject course semester")
    .sort({ createdAt: -1 });

  return res.json(plan);
});

router.get("/:id/pdf", protect, async (req, res) => {
  const plan = await ExamPlan.findById(req.params.id);
  if (!plan?.pdfPath) return res.status(404).json({ message: "PDF not found" });
  return res.sendFile(path.resolve(plan.pdfPath));
});

export default router;
