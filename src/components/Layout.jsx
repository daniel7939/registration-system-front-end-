import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "2000",
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            background: "var(--surface)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--card-border)",
            display: "none", // Controlled by CSS
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
        }}
      >
        {isSidebarOpen ? <X size={24} color="var(--primary)" /> : <Menu size={24} color="var(--primary)" />}
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Layout;
