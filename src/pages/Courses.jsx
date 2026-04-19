// src/pages/Courses.jsx
import { useState, useEffect, useContext } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Search, BookPlus, Info, Building2, ShieldAlert, GraduationCap } from "lucide-react";
import { DEPARTMENTS } from "../constants/departments";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All Departments");
    const { user } = useContext(AuthContext);
    const { request, loading, error, success } = useApi();

    const fetchCourses = async () => {
        try {
            const data = await request("GET", "/courses");
            setCourses(data);
            
            // Also fetch current status to find enrolled IDs and calculate credits
            const statusData = await request("GET", "/courses/status");
            setMyCourses(statusData);
        } catch (e) { /* error handled by hook */ }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleRegister = async (courseId) => {
        if (user?.role === "admin") return;
        try {
            await request("POST", "/registrations", { courseId });
            fetchCourses(); // Refresh to show "Enrolled" and update credits
        } catch (e) { /* error handled by hook */ }
    };

    const myEnrolledIds = myCourses.map(c => c.id);
    const totalCredits = myCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);

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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h2>Course Catalog</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                       Discover and enroll in upcoming specialized semester courses.
                    </p>
                </div>
                
                {user?.role !== "admin" && (
                    <div style={{ 
                        background: "var(--surface)", 
                        padding: "15px 25px", 
                        borderRadius: "20px", 
                        border: "1px solid var(--card-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}>
                        <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "12px", 
                            background: totalCredits >= 35 ? "rgba(239, 68, 68, 0.1)" : "rgba(6, 182, 212, 0.1)", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                        }}>
                            <GraduationCap size={20} color={totalCredits >= 35 ? "#ef4444" : "var(--primary)"} />
                        </div>
                        <div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Current Load</div>
                            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: totalCredits >= 35 ? "#ef4444" : "white" }}>
                                {totalCredits} / 35 <span style={{ fontSize: "0.85rem", fontWeight: "400", color: "var(--text-muted)" }}>Credits</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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
                            
                            {user?.role === "admin" ? (
                                <div style={{ 
                                    background: "rgba(255, 255, 255, 0.05)", 
                                    color: "var(--text-muted)", 
                                    padding: "14px", 
                                    borderRadius: "12px", 
                                    textAlign: "center",
                                    fontSize: "0.85rem",
                                    marginTop: "25px",
                                    border: "1px solid var(--card-border)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px"
                                }}>
                                    <ShieldAlert size={16} />
                                    Admin View Only
                                </div>
                            ) : myEnrolledIds.includes(course.id) ? (
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
                                    disabled={totalCredits >= 35}
                                    style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        gap: "10px",
                                        opacity: totalCredits >= 35 ? 0.5 : 1,
                                        cursor: totalCredits >= 35 ? "not-allowed" : "pointer"
                                    }}
                                >
                                    <BookPlus size={18} />
                                    {totalCredits >= 35 ? "Limit Reached" : "Register Now"}
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
