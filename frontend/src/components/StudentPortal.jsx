import { useState } from "react";
import api from "../api";

const initial = { name: "", rollNumber: "", course: "", semester: "", subjects: "", email: "" };

export default function StudentPortal({ user }) {
  const [form, setForm] = useState({ ...initial, rollNumber: user.rollNumber || "" });
  const [status, setStatus] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      subjects: form.subjects.split(",").map((subject) => subject.trim())
    };
    await api.post("/forms/submit", payload);
    setStatus("Exam form submitted successfully");
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Student Exam Form</h3>
      {Object.keys(initial).map((field) => (
        <input
          key={field}
          placeholder={field}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          required
        />
      ))}
      <button type="submit">Submit Form</button>
      {status && <p className="muted">{status}</p>}
    </form>
  );
}
