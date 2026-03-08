import mongoose from "mongoose";

const examFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true }],
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ["submitted", "approved", "rejected"], default: "submitted" }
  },
  { timestamps: true }
);

export const ExamForm = mongoose.model("ExamForm", examFormSchema);
