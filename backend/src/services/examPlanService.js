import { Subject } from "../models/Subject.js";
import { ExamForm } from "../models/ExamForm.js";
import { Classroom } from "../models/Classroom.js";
import { Faculty } from "../models/Faculty.js";

const DEFAULT_TIME = "9:00 AM";

export const buildExamPlan = async ({ courseId, semesterId }) => {
  const [subjects, forms, classrooms, faculty] = await Promise.all([
    Subject.find({ course: courseId, semester: semesterId }).sort({ subjectName: 1 }),
    ExamForm.find({ course: courseId, semester: semesterId, status: { $in: ["submitted", "approved"] } }).sort({ rollNumber: 1 }),
    Classroom.find().sort({ roomCapacity: -1 }),
    Faculty.find().sort({ name: 1 })
  ]);

  if (!subjects.length) throw new Error("No subjects found for selected course/semester");
  if (!forms.length) throw new Error("No student forms found for selected course/semester");
  if (!classrooms.length) throw new Error("No classrooms configured");
  if (!faculty.length) throw new Error("No faculty available for invigilation");

  const baseDate = new Date();
  const dateSheet = subjects.map((subject, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index * 2);
    return {
      subject: subject._id,
      subjectName: subject.subjectName,
      date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      time: DEFAULT_TIME
    };
  });

  const seatingArrangement = [];
  const roomAllocation = [];
  const rollNumbers = forms.map((item) => item.rollNumber);
  let pointer = 0;

  classrooms.forEach((room) => {
    if (pointer >= rollNumbers.length) return;

    const assigned = Math.min(room.roomCapacity, rollNumbers.length - pointer);
    roomAllocation.push({ room: room.roomNumber, assignedCount: assigned, capacity: room.roomCapacity });

    for (let bench = 1; bench <= room.numberOfBenches; bench += 1) {
      for (let seat = 1; seat <= room.seatsPerBench; seat += 1) {
        if (pointer >= rollNumbers.length) break;
        seatingArrangement.push({
          room: room.roomNumber,
          benchNumber: bench,
          seatNumber: seat,
          rollNumber: rollNumbers[pointer]
        });
        pointer += 1;
      }
    }
  });

  if (pointer < rollNumbers.length) {
    throw new Error("Insufficient room capacity for enrolled students");
  }

  const invigilators = roomAllocation.map((room, index) => {
    const assigned = faculty[index % faculty.length];
    return { room: room.room, facultyName: assigned.name, facultyId: assigned.facultyId };
  });

  return { dateSheet, seatingArrangement, roomAllocation, invigilators };
};
