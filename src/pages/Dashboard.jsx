// src/pages/Dashboard.jsx
import { useState, useEffect, useContext } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Trash2, BookOpen, Clock } from "lucide-react";

function Dashboard() {
    const [myCourses, setMyCourses] = useState([]);
    const { user } = useContext(AuthContext);
    const { request, loading, error, success } = useApi();

    const fetchMyStatus = async () => {
        try {
            const data = await request("GET", "/courses/status");
            setMyCourses(data);
        } catch (e) { /* Error handled by hook */ }
    };

    useEffect(() => {
        fetchMyStatus();
    }, []); 

    const handleDrop = async (courseId) => {
        try {
            await request("DELETE", "/registrations", { courseId });
            fetchMyStatus(); // Refresh magically
        } catch (e) { /* Error handled by hook */ }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h2>Student Dashboard</h2>
                    <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "var(--text-muted)" }}>
                    Oversee your current academic schedule and registration activities.
                    </p>
                </div>
                <button 
                    onClick={() => window.print()}
                    style={{ width: "auto", margin: 0, padding: "12px 24px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", gap: "10px" }}
                >
                    <BookOpen size={18} />
                    Download Schedule (PDF)
                </button>
            </div>

            {/* Hidden header visible only during print */}
            <div className="print-header">
                <h1 style={{ color: "black", marginBottom: "5px" }}>OFFICIAL ACADEMIC TRANSCRIPT</h1>
                <p style={{ color: "#666" }}>University Enrollment System - Semester 2026</p>
                <div style={{ margin: "20px 0", borderTop: "1px solid #000", borderBottom: "1px solid #000", padding: "10px 0", textAlign: "left" }}>
                    <strong>Student Name:</strong> {user?.name || "Academic User"}<br/>
                    <strong>Date of Issue:</strong> {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Analytics Ribbon */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>Total Credits</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--primary)" }}>
                        {myCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0)}
                    </div>
                </div>
                <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>Course Count</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--secondary)" }}>
                        {myCourses.length}
                    </div>
                </div>
                <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>Academic Status</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#10b981", display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                        Good Standing
                    </div>
                </div>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <motion.div 
                className="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {myCourses.map((course) => (
                    <motion.div 
                        className="card" 
                        key={course.id}
                        layout
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <div className="card-title">{course.name}</div>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                    <span className="badge">{course.credits} Credits</span>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Clock size={14} /> Active
                                    </span>
                                </div>
                            </div>
                            <BookOpen size={24} style={{ color: "var(--primary)", opacity: 0.5 }} />
                        </div>
                        <button 
                            className="btn-danger"
                            onClick={() => handleDrop(course.id)}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                        >
                            <Trash2 size={18} />
                            Drop Course
                        </button>
                    </motion.div>
                ))}
            </motion.div>

            {myCourses.length === 0 && !loading && !error && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)", background: "var(--surface)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}
                >
                    <BookOpen size={48} style={{ marginBottom: "20px", opacity: 0.3 }} />
                    <h3>No Active Registrations</h3>
                    <p>Your schedule is currently empty. Visit the Course Catalog to start enrolling.</p>
                </motion.div>
            )}
        </div>
    );
}

export default Dashboard;
