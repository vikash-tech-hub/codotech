import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    semesterId: { type: String, required: true, unique: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semesterNumber: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Semester = mongoose.model("Semester", semesterSchema);
