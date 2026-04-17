// src/pages/Profile.jsx
import { useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { motion } from "framer-motion";
import { User, Mail, Save, UserCircle, Building2 } from "lucide-react";
import { DEPARTMENTS } from "../constants/departments";

function Profile() {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [department, setDepartment] = useState(user?.department || "");
    const { request, loading, error, success } = useApi();

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setDepartment(user.department || DEPARTMENTS[0]);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await request("PUT", "/auth/profile", { name, email, department });
        } catch (e) { /* Error handled by hook */ }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ maxWidth: "600px" }}
        >
            <h2>My Profile</h2>
            <p style={{ marginBottom: "30px", color: "var(--text-muted)", fontSize: "1.1rem" }}>
                Manage your public academic identity and contact information.
            </p>

            <div className="container" style={{ padding: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(6, 182, 212, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--primary)" }}>
                        <UserCircle size={48} color="var(--primary)" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1.5rem" }}>{user?.name}</h3>
                        <div style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: "600" }}>
                            {user?.role?.toUpperCase()} | {user?.department}
                        </div>
                    </div>
                </div>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleUpdate}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)" }}>
                            <User size={16} /> Full Name
                        </label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)" }}>
                            <Mail size={16} /> Email Address
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "16px", borderRadius: "12px" }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "var(--text-muted)" }}>
                            <Building2 size={16} /> Academic Department
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

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                    >
                        <Save size={20} />
                        {loading ? "Saving..." : "Update Credentials"}
                    </button>
                </form>
            </div>
        </motion.div>
    );
}

export default Profile;
