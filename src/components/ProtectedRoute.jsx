import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// A wrapper that acts as a secure Bouncer. 
function ProtectedRoute({ children, requireAdmin = false }) {
    const { user, loading } = useContext(AuthContext);

    // Prevent flashing redirects before token is parsed silently
    if (loading) return null; 

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />; // Kick unauthorized students back to dashboard
    }

    // If completely cleared, let them into the page!
    return children;
}

export default ProtectedRoute;
