import { useMemo, useState } from "react";
import api from "../api";

const entityFields = {
  courses: ["courseId", "courseName"],
  semesters: ["semesterId", "course", "semesterNumber"],
  subjects: ["subjectId", "subjectName", "course", "semester"],
  classrooms: ["roomNumber", "numberOfBenches", "seatsPerBench"],
  faculties: ["facultyId", "name", "department"]
};

export default function AdminDashboard({ analytics, forms }) {
  const [entity, setEntity] = useState("courses");
  const [formData, setFormData] = useState({});
  const [planParams, setPlanParams] = useState({ courseId: "", semesterId: "" });
  const [message, setMessage] = useState("");

  const fields = useMemo(() => entityFields[entity], [entity]);

  const createMaster = async () => {
    await api.post(`/master/${entity}`, formData);
    setMessage(`${entity} entry created`);
    setFormData({});
  };

  const generatePlan = async () => {
    const { data } = await api.post("/plans/generate", planParams);
    setMessage(`Exam plan generated. PDF: ${data.pdfPath}`);
  };

  return (
    <section className="grid">
      <div className="card">
        <h3>Analytics</h3>
        <ul>
          <li>Total Forms: {analytics.forms}</li>
          <li>Submitted: {analytics.submitted}</li>
          <li>Approved: {analytics.approved}</li>
          <li>Courses: {analytics.courses}</li>
          <li>Subjects: {analytics.subjects}</li>
          <li>Classrooms: {analytics.classrooms}</li>
          <li>Faculty: {analytics.faculty}</li>
        </ul>
      </div>

      <div className="card">
        <h3>Master Data CRUD</h3>
        <select value={entity} onChange={(e) => setEntity(e.target.value)}>
          {Object.keys(entityFields).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fields.map((field) => (
          <input
            key={field}
            placeholder={field}
            value={formData[field] || ""}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          />
        ))}
        <button onClick={createMaster} type="button">
          Save {entity}
        </button>
      </div>

      <div className="card">
        <h3>Generate Exam Plan</h3>
        <input
          placeholder="Course ID (_id)"
          value={planParams.courseId}
          onChange={(e) => setPlanParams({ ...planParams, courseId: e.target.value })}
        />
        <input
          placeholder="Semester ID (_id)"
          value={planParams.semesterId}
          onChange={(e) => setPlanParams({ ...planParams, semesterId: e.target.value })}
        />
        <button onClick={generatePlan} type="button">
          Generate Exam Plan
        </button>
        {message && <p className="muted">{message}</p>}
      </div>

      <div className="card span-2">
        <h3>Student Forms (Search/Filter ready via backend API)</h3>
        <table>
          <thead>
            <tr>
              <th>Roll</th>
              <th>Name</th>
              <th>Status</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((row) => (
              <tr key={row._id}>
                <td>{row.rollNumber}</td>
                <td>{row.name}</td>
                <td>{row.status}</td>
                <td>{row.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
