import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  ShieldCheck, 
  LogOut, 
  GraduationCap 
} from "lucide-react";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
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
          <Link 
            to="/admin" 
            className={`sidebar-link ${isActive("/admin") ? "active" : ""}`}
          >
            <ShieldCheck size={20} />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
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
          style={{ width: "100%", marginTop: "10px", cursor: "pointer" }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
