import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNumber: { type: String, unique: true, sparse: true },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student"], required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
