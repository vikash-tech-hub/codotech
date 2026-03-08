import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true, unique: true, trim: true },
    courseName: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
