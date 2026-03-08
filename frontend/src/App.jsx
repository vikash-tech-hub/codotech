import { useEffect, useState } from "react";
import api from "./api";
import LoginPanel from "./components/LoginPanel";
import AdminDashboard from "./components/AdminDashboard";
import StudentPortal from "./components/StudentPortal";

export default function App() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({});
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");

  const onLogin = async (credentials) => {
    try {
      setError("");
      const { data } = await api.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadAdminData = async () => {
      const [analyticsRes, formsRes] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/forms/all")
      ]);
      setAnalytics(analyticsRes.data);
      setForms(formsRes.data);
    };

    loadAdminData();
  }, [user]);

  return (
    <main>
      <header>
        <h1>AI Based College Examination Management System</h1>
      </header>
      {!user && <LoginPanel onLogin={onLogin} />}
      {error && <p className="error">{error}</p>}
      {user?.role === "admin" && <AdminDashboard analytics={analytics} forms={forms} />}
      {user?.role === "student" && <StudentPortal user={user} />}
    </main>
  );
}
