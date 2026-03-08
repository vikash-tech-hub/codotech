import express from "express";
import { ExamForm } from "../models/ExamForm.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", protect, authorize("student"), async (req, res) => {
  try {
    const payload = { ...req.body, rollNumber: req.user.rollNumber };
    const form = await ExamForm.create(payload);
    return res.status(201).json(form);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/my-status", protect, authorize("student"), async (req, res) => {
  const forms = await ExamForm.find({ rollNumber: req.user.rollNumber }).sort({ createdAt: -1 });
  return res.json(forms);
});

router.get("/all", protect, authorize("admin"), async (req, res) => {
  const { search = "", status } = req.query;
  const query = {
    rollNumber: { $regex: search, $options: "i" }
  };
  if (status) query.status = status;

  const forms = await ExamForm.find(query).populate("course semester subjects").sort({ createdAt: -1 });
  return res.json(forms);
});

router.patch("/:id/status", protect, authorize("admin"), async (req, res) => {
  const form = await ExamForm.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  return res.json(form);
});

export default router;
