import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On load, see if there is a JWT Token saved in the current SESSION!
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role, department: payload.department });
            } catch (e) {
                console.error("Invalid token", e);
                sessionStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Use sessionStorage so the login "expires" when the tab is closed
        sessionStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
