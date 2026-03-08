import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    numberOfBenches: { type: Number, required: true, min: 1 },
    seatsPerBench: { type: Number, required: true, min: 1 },
    roomCapacity: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

classroomSchema.pre("validate", function computeCapacity(next) {
  this.roomCapacity = this.numberOfBenches * this.seatsPerBench;
  next();
});

export const Classroom = mongoose.model("Classroom", classroomSchema);
