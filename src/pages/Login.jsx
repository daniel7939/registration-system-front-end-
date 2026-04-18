// src/pages/Login.jsx
import { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, GraduationCap } from "lucide-react";

function Login({ onToggleView }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);
        
        axios.post("/auth/login", { email, password })
            .then((response) => {
                login(response.data.user, response.data.token);
                navigate("/");
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Login failed. Check your email and password.");
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
                        <h2 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>University Portal</h2>
                        <p style={{ color: "var(--text-muted)" }}>Secure Academic Entry</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}
                    
                    <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                <Mail size={16} /> Student Email
                            </label>
                            <input 
                                type="email" 
                                placeholder="test@student.edu" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                                required
                            />
                        </div>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                                <Lock size={16} /> Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                                required
                            />
                        </div>

                        <button type="submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                            <LogIn size={20} />
                            Sign In
                        </button>
                    </form>

                    <div style={{ marginTop: "30px", fontSize: "0.95rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>New student? </span>
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
                            Create Account
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
