import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  ShieldCheck, 
  LogOut, 
  GraduationCap,
  Users,
  Sun,
  Moon
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <GraduationCap size={32} />
        <span>UniPortal</span>
      </div>

      <nav className="sidebar-links">
        <Link 
          to="/" 
          className={`sidebar-link ${isActive("/") ? "active" : ""}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/courses" 
          className={`sidebar-link ${isActive("/courses") ? "active" : ""}`}
        >
          <BookOpen size={20} />
          <span>Courses</span>
        </Link>

        <Link 
          to="/profile" 
          className={`sidebar-link ${isActive("/profile") ? "active" : ""}`}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>

        {user?.role === "admin" && (
          <>
            <div style={{ padding: "20px 16px 10px", fontSize: "0.75rem", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Management
            </div>
            <Link 
              to="/admin" 
              className={`sidebar-link ${isActive("/admin") ? "active" : ""}`}
            >
              <ShieldCheck size={20} />
              <span>Analytics</span>
            </Link>
            <Link 
              to="/admin/students" 
              className={`sidebar-link ${isActive("/admin/students") ? "active" : ""}`}
            >
              <Users size={20} />
              <span>Students</span>
            </Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="sidebar-link"
          style={{ 
            width: "100%", 
            marginBottom: "15px", 
            background: "rgba(255,255,255,0.05)", 
            marginTop: "0",
            border: "1px solid var(--card-border)",
            justifyContent: "center"
          }}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {user && (
          <div style={{ marginBottom: "20px", padding: "0 16px" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Logged in as</div>
            <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--primary)" }}>
              {user.name} {user.role === "admin" && "👑"}
            </div>
          </div>
        )}
        <button 
          onClick={logout} 
          className="sidebar-link btn-logout" 
          style={{ width: "100%", cursor: "pointer" }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
