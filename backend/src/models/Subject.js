import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectId: { type: String, required: true, unique: true, trim: true },
    subjectName: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true }
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);
