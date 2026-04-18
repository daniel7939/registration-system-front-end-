import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Building2, ShieldCheck, CreditCard, Calendar } from "lucide-react";

function Profile() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div>
            <h2>Student Profile</h2>
            <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "var(--text-muted)" }}>
               Manage your academic identity and account security.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px", alignItems: "start" }}>
                
                {/* Virtual ID Card */}
                <motion.div 
                    initial={{ rotateY: -20, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    style={{ perspective: "1000px" }}
                >
                    <div style={{ 
                        background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        padding: "30px",
                        borderRadius: "24px",
                        height: "220px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 20px 40px rgba(6, 182, 212, 0.3)",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        {/* Decorative Background Circles */}
                        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}></div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ background: "white", padding: "8px", borderRadius: "10px" }}>
                                    <CreditCard color="var(--primary)" size={20} />
                                </div>
                                <span style={{ color: "white", fontWeight: "800", letterSpacing: "1px", fontSize: "0.9rem" }}>STUDENT PASS</span>
                            </div>
                            <ShieldCheck color="white" size={24} />
                        </div>

                        <div>
                            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Identification Name</div>
                            <div style={{ color: "white", fontSize: "1.4rem", fontWeight: "600", marginBottom: "5px" }}>{user.name}</div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem" }}>ID: ####{user.id.toString().slice(-4)}</div>
                                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem" }}>{user.role.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Account Details */}
                <div className="container" style={{ margin: 0 }}>
                    <h3 style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <User size={20} color="var(--primary)" />
                        Account Credentials
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                            <Mail size={20} color="var(--text-muted)" />
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Verified Email Address</div>
                                <div style={{ fontWeight: "500" }}>{user.email}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                            <Building2 size={20} color="var(--text-muted)" />
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Primary Department</div>
                                <div style={{ fontWeight: "500" }}>{user.department || "General Sciences"}</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                            <Calendar size={20} color="var(--text-muted)" />
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Registration Date</div>
                                <div style={{ fontWeight: "500" }}>January 2026 Batch</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: "30px", padding: "20px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "16px", display: "flex", alignItems: "center", gap: "15px" }}>
                        <ShieldCheck color="#10b981" />
                        <div>
                            <div style={{ color: "#10b981", fontWeight: "600" }}>Identity Verified</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Your student credentials are cryptographically secured by Supabase Auth.</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Profile;
