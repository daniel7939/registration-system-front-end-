// src/pages/SignUp.jsx
import { useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, GraduationCap, Building2 } from "lucide-react";
import { DEPARTMENTS } from "../constants/departments";

function SignUp({ onToggleView }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState(DEPARTMENTS[0]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSignUp = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        axios.post("/auth/signup", { name, email, password, department })
            .then((response) => {
                setSuccess("Account created securely! Switching to Login...");
                setTimeout(() => onToggleView(), 2000);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Sign Up failed. Please try again.");
            });
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: "100%", maxWidth: "450px" }}
            >
                <div className="container" style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "30px" }}>
                        <GraduationCap size={48} color="var(--primary)" style={{ marginBottom: "15px" }} />
                        <h2 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>Create Identity</h2>
                        <p style={{ color: "var(--text-muted)" }}>Join the Global Academic Network</p>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-error">{error}</div>}
                    
                    <form onSubmit={handleSignUp} style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                <User size={16} /> Full Name
                            </label>
                            <input 
                                type="text" 
                                placeholder="Jane Doe" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                <Mail size={16} /> Student Email
                            </label>
                            <input 
                                type="email" 
                                placeholder="name@university.edu" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                <Building2 size={16} /> Assigned Department
                            </label>
                            <select 
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                                required
                            >
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                <Lock size={16} /> Secure Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="At least 6 characters" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                                required
                            />
                        </div>

                        <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                            <UserPlus size={20} />
                            Register Account
                        </button>
                    </form>

                    <div style={{ marginTop: "30px", fontSize: "0.95rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Already registered? </span>
                        <button 
                            onClick={onToggleView}
                            style={{ 
                                background: "none", 
                                border: "none", 
                                color: "var(--primary)", 
                                cursor: "pointer", 
                                fontWeight: "600",
                                padding: 0,
                                fontSize: "inherit"
                            }}
                        >
                            Login Here
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SignUp;
