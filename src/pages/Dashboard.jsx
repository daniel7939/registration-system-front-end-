// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { motion } from "framer-motion";
import { Trash2, BookOpen, Clock } from "lucide-react";

function Dashboard() {
    const [myCourses, setMyCourses] = useState([]);
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
            <h2>Student Dashboard</h2>
            <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "var(--text-muted)" }}>
               Oversee your current academic schedule and registration activities.
            </p>

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
