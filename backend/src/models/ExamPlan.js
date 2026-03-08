import mongoose from "mongoose";

const examPlanSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: "Semester", required: true },
    dateSheet: [
      {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        date: String,
        time: String
      }
    ],
    seatingArrangement: [
      {
        room: String,
        benchNumber: Number,
        seatNumber: Number,
        rollNumber: String
      }
    ],
    roomAllocation: [
      {
        room: String,
        assignedCount: Number,
        capacity: Number
      }
    ],
    invigilators: [
      {
        room: String,
        facultyName: String,
        facultyId: String
      }
    ],
    pdfPath: String
  },
  { timestamps: true }
);

examPlanSchema.index({ course: 1, semester: 1, createdAt: -1 });

export const ExamPlan = mongoose.model("ExamPlan", examPlanSchema);
