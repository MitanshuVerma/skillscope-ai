import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.PROD ? "" : "http://localhost:5000";

interface User {
    _id: string;
    googleId: string;
    name: string;
    email: string;
    picture?: string;
    skills?: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, setUser: () => {}, logout: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            // Check for token in URL first
            const params = new URLSearchParams(window.location.search);
            const tokenFromUrl = params.get('token');
            if (tokenFromUrl) {
                localStorage.setItem('token', tokenFromUrl);
                // Remove token from URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/auth/current-user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
