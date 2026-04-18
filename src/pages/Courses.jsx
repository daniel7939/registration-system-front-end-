// src/pages/Courses.jsx
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { motion } from "framer-motion";
import { Search, BookPlus, Info, Building2 } from "lucide-react";
import { DEPARTMENTS } from "../constants/departments";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [myEnrolledIds, setMyEnrolledIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All Departments");
    const { request, loading, error, success } = useApi();

    const fetchCourses = async () => {
        try {
            const data = await request("GET", "/courses");
            setCourses(data);
            
            // Also fetch current status to find enrolled IDs
            const statusData = await request("GET", "/courses/status");
            setMyEnrolledIds(statusData.map(c => c.id));
        } catch (e) { /* error handled by hook */ }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleRegister = async (courseId) => {
        try {
            await request("POST", "/registrations", { courseId });
        } catch (e) { /* error handled by hook */ }
    };

    const filteredCourses = courses.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === "All Departments" || c.department === selectedDept;
        return matchesSearch && matchesDept;
    });

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div>
            <h2>Course Catalog</h2>
            <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "var(--text-muted)" }}>
               Discover and enroll in upcoming specialized semester courses.
            </p>

            {/* Controls Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", marginBottom: "40px" }}>
                {/* Search Bar */}
                <div style={{ position: "relative" }}>
                    <Search size={20} style={{ position: "absolute", left: "16px", top: "18px", color: "var(--text-muted)" }} />
                    <input 
                        type="text" 
                        placeholder="Search courses by name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "100%", padding: "18px 18px 18px 50px", borderRadius: "16px", fontSize: "1rem" }}
                    />
                </div>

                {/* Dept Filter */}
                <div style={{ position: "relative" }}>
                    <Building2 size={20} style={{ position: "absolute", left: "16px", top: "18px", color: "var(--text-muted)" }} />
                    <select 
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        style={{ width: "100%", padding: "18px 18px 18px 50px", borderRadius: "16px", fontSize: "1rem", background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", appearance: "none" }}
                    >
                        <option value="All Departments">All Departments</option>
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}

            <motion.div 
                className="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {loading && courses.length === 0 ? (
                    <>
                        <div className="skeleton"></div>
                        <div className="skeleton"></div>
                        <div className="skeleton"></div>
                    </>
                ) : (
                    filteredCourses.map((course) => (
                        <motion.div 
                            className="card" 
                            key={course.id}
                            variants={itemVariants}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ flex: 1 }}>
                                    <div className="card-title" style={{ marginBottom: "5px" }}>{course.name}</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                                        <span className="badge" style={{ background: "rgba(6, 182, 212, 0.1)" }}>{course.credits} Credits</span>
                                        <span className="badge" style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--secondary)" }}>{course.department}</span>
                                    </div>
                                </div>
                                <Info size={20} style={{ color: "var(--text-muted)", cursor: "help" }} />
                            </div>
                            
                            {myEnrolledIds.includes(course.id) ? (
                                <div style={{ 
                                    background: "rgba(16, 185, 129, 0.1)", 
                                    color: "#10b981", 
                                    padding: "14px", 
                                    borderRadius: "12px", 
                                    textAlign: "center",
                                    fontWeight: "600",
                                    marginTop: "25px",
                                    border: "1px solid rgba(16, 185, 129, 0.2)"
                                }}>
                                    ✓ Enrolled
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleRegister(course.id)}
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                                >
                                    <BookPlus size={18} />
                                    Register Now
                                </button>
                            )}
                        </motion.div>
                    ))
                )}
            </motion.div>

            {!loading && filteredCourses.length === 0 && !error && (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                    No courses found matching your criteria.
                </div>
            )}
        </div>
    );
}

export default Courses;
