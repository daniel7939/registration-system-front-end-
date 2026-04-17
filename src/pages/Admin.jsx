// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Activity, 
  PlusCircle, 
  Trash2, 
  ShieldAlert, 
  Database,
  Hash,
  Pencil,
  XCircle,
  Save,
  Building2
} from "lucide-react";
import { DEPARTMENTS } from "../constants/departments";

function Admin() {
    const [stats, setStats] = useState({ students: 0, courses: 0, registrations: 0 });
    const [allCourses, setAllCourses] = useState([]);
    
    // Form States
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [credits, setCredits] = useState("");
    const [department, setDepartment] = useState(DEPARTMENTS[0]);
    const [editingCourse, setEditingCourse] = useState(null); 

    const { request, loading, error, success, setError, setSuccess } = useApi();

    const fetchAdminData = async () => {
        try {
            const statsData = await request("GET", "/admin/stats");
            setStats(statsData);
            const courseData = await request("GET", "/courses");
            setAllCourses(courseData);
        } catch (e) { /* Error handled by hook */ }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await request("PUT", `/admin/courses/${editingCourse.id}`, { name, capacity, credits, department });
                setEditingCourse(null);
            } else {
                await request("POST", "/admin/courses", { name, capacity, credits, department });
            }
            setName(""); setCapacity(""); setCredits(""); setDepartment(DEPARTMENTS[0]);
            fetchAdminData();
        } catch (e) { /* Error handled by hook */ }
    };

    const handleEditClick = (course) => {
        setEditingCourse(course);
        setName(course.name);
        setCapacity(course.capacity);
        setCredits(course.credits);
        setDepartment(course.department || DEPARTMENTS[0]);
        setSuccess(null);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingCourse(null);
        setName(""); setCapacity(""); setCredits(""); setDepartment(DEPARTMENTS[0]);
        setSuccess(null);
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Are you absolutely sure?")) return;
        try {
            await request("DELETE", `/admin/courses/${id}`);
            fetchAdminData();
        } catch (e) { /* Error handled by hook */ }
    };

    return (
        <div>
            <h2>Admin Command Center</h2>
            <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "var(--text-muted)" }}>
               Oversee system-wide curriculum, enrollment health, and user distribution.
            </p>

            {/* Stats Ribbon */}
            <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "40px" }}>
                <div className="card" style={{ padding: "20px", textAlign: "center", borderTop: "4px solid var(--primary)" }}>
                    <Users size={32} color="var(--primary)" style={{ margin: "0 auto 10px" }} />
                    <div style={{ fontSize: "2rem", fontWeight: "800" }}>{stats.students}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total Students</div>
                </div>
                <div className="card" style={{ padding: "20px", textAlign: "center", borderTop: "4px solid var(--secondary)" }}>
                    <BookOpen size={32} color="var(--secondary)" style={{ margin: "0 auto 10px" }} />
                    <div style={{ fontSize: "2rem", fontWeight: "800" }}>{stats.courses}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Active Courses</div>
                </div>
                <div className="card" style={{ padding: "20px", textAlign: "center", borderTop: "4px solid #10b981" }}>
                    <Activity size={32} color="#10b981" style={{ margin: "0 auto 10px" }} />
                    <div style={{ fontSize: "2rem", fontWeight: "800" }}>{stats.registrations}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Full Enrollments</div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px", alignItems: "start" }}>
                
                {/* Course Management Table */}
                <div className="container" style={{ padding: "40px", margin: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
                        <Database size={24} color="var(--primary)" />
                        <span style={{ fontWeight: "600", fontSize: "1.2rem" }}>Central Curriculum Ledger</span>
                    </div>

                    {allCourses.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No courses found.</p> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {allCourses.map(course => (
                                <div key={course.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "15px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div>
                                        <div style={{ fontWeight: "600" }}>{course.name}</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{course.department} | Cap: {course.capacity}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button 
                                            className="sidebar-link" 
                                            onClick={() => handleEditClick(course)}
                                            style={{ width: "auto", margin: 0, padding: "8px 12px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.1)", border: "1px solid var(--primary)" }}
                                        >
                                            <Pencil size={16} color="var(--primary)" />
                                        </button>
                                        <button 
                                            className="btn-danger" 
                                            onClick={() => handleDeleteCourse(course.id)}
                                            style={{ width: "auto", margin: 0, padding: "8px 12px", borderRadius: "8px" }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create/Edit Course Form */}
                <div className="container" style={{ padding: "40px", margin: 0, border: editingCourse ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
                        {editingCourse ? <Pencil size={24} color="var(--primary)" /> : <PlusCircle size={24} color="var(--primary)" />}
                        <span style={{ fontWeight: "600", fontSize: "1.2rem" }}>
                            {editingCourse ? "Update Course Details" : "Deploy New Course"}
                        </span>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-error">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Course Title</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "10px" }} required />
                        </div>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Department</label>
                            <select 
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{ width: "100%", padding: "14px", borderRadius: "10px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                                required
                            >
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Capacity</label>
                                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "10px" }} required />
                            </div>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Credits</label>
                                <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "10px" }} required />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                {editingCourse ? <Save size={18} /> : <PlusCircle size={18} />}
                                {loading ? "Syncing..." : (editingCourse ? "Save Changes" : "Publish Course")}
                            </button>
                            {editingCourse && (
                                <button type="button" onClick={cancelEdit} className="btn-logout" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--text-muted)", color: "var(--text-muted)" }}>
                                    <XCircle size={18} />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Admin;
