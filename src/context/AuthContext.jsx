import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On load, see if there is a JWT Token saved!
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Decode the JWT payload. It's base64 encoded.
                // A JWT has 3 parts separated by dots, the payload is the middle part.
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Set the user state with the decrypted payload securely!
                setUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Save the encrypted VIP Pass forever in memory
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
