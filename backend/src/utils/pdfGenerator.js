import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export const generatePlanPdf = async ({ courseName, semesterNumber, dateSheet, roomAllocation, seatingArrangement, invigilators }) => {
  const reportsDir = path.resolve("reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  const filePath = path.join(reportsDir, `exam-plan-${Date.now()}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 36 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("College Examination Plan", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Course: ${courseName}`);
    doc.text(`Semester: ${semesterNumber}`);

    doc.moveDown();
    doc.fontSize(14).text("Date Sheet");
    doc.moveDown(0.3);
    dateSheet.forEach((item) => doc.fontSize(11).text(`${item.subjectName} - ${item.date} - ${item.time}`));

    doc.moveDown();
    doc.fontSize(14).text("Room Allocation");
    roomAllocation.forEach((room) => doc.fontSize(11).text(`${room.room}: ${room.assignedCount}/${room.capacity}`));

    doc.moveDown();
    doc.fontSize(14).text("Seating Arrangement");
    seatingArrangement.forEach((seat) =>
      doc.fontSize(11).text(`${seat.room} | Bench ${seat.benchNumber} Seat ${seat.seatNumber} → ${seat.rollNumber}`)
    );

    doc.moveDown();
    doc.fontSize(14).text("Invigilator Duties");
    invigilators.forEach((inv) => doc.fontSize(11).text(`${inv.room} → ${inv.facultyName}`));

    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};
