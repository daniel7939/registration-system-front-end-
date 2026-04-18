import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { motion } from "framer-motion";
import { User, Mail, Building2, Calendar } from "lucide-react";

function StudentDirectory() {
    const [students, setStudents] = useState([]);
    const { request, loading, error } = useApi();

    const fetchStudents = async () => {
        try {
            const data = await request("GET", "/admin/students");
            setStudents(data);
        } catch (e) { /* Error handled by hook */ }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Student Directory</h2>
            <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "var(--text-muted)" }}>
               Oversee and manage the student population.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="grid">
                {loading ? (
                    <div className="skeleton"></div>
                ) : (
                    students.map((student) => (
                        <motion.div 
                            className="card" 
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                                <div style={{ 
                                    width: "50px", 
                                    height: "50px", 
                                    borderRadius: "50%", 
                                    background: "rgba(6, 182, 212, 0.1)", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    color: "var(--primary)"
                                }}>
                                    <User size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text)" }}>{student.name}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                                        <Mail size={14} /> {student.email}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem" }}>
                                    <Building2 size={16} color="var(--primary)" />
                                    <span>{student.department}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                                    <Calendar size={16} />
                                    <span>Joined {new Date(student.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

export default StudentDirectory;
