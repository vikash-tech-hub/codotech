import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { Course } from "../models/Course.js";
import { Semester } from "../models/Semester.js";
import { Subject } from "../models/Subject.js";
import { Classroom } from "../models/Classroom.js";
import { Faculty } from "../models/Faculty.js";

const router = express.Router();

const modelMap = {
  courses: Course,
  semesters: Semester,
  subjects: Subject,
  classrooms: Classroom,
  faculties: Faculty
};

router.use(protect, authorize("admin"));

router.get("/:entity", async (req, res) => {
  try {
    const Model = modelMap[req.params.entity];
    if (!Model) return res.status(400).json({ message: "Unsupported entity" });
    const rows = await Model.find();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/:entity", async (req, res) => {
  try {
    const Model = modelMap[req.params.entity];
    if (!Model) return res.status(400).json({ message: "Unsupported entity" });
    const created = await Model.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:entity/:id", async (req, res) => {
  try {
    const Model = modelMap[req.params.entity];
    if (!Model) return res.status(400).json({ message: "Unsupported entity" });
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:entity/:id", async (req, res) => {
  try {
    const Model = modelMap[req.params.entity];
    if (!Model) return res.status(400).json({ message: "Unsupported entity" });
    await Model.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
