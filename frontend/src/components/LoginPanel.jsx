import { useState } from "react";

const initial = { identifier: "", password: "", role: "student" };

export default function LoginPanel({ onLogin }) {
  const [form, setForm] = useState(initial);

  const submit = (event) => {
    event.preventDefault();
    onLogin(form);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login Portal</h2>
      <p className="muted">Admin: Email + Password | Student: Roll Number + Password</p>
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="admin">Admin / Exam Cell</option>
      </select>
      <input
        placeholder={form.role === "admin" ? "Admin Email" : "Roll Number"}
        value={form.identifier}
        onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
