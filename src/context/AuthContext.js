import React, { createContext, useState, useContext, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                await verifyToken(token);
            } else {
                setLoading(false);
            }
        };
        
        checkAuth();
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            console.log('Respuesta de verificación:', data);

            if (response.ok && data.success) {
                // Asegúrate de que el usuario se establezca correctamente
                setUser({
                    id: data.usuario.id,
                    username: data.usuario.username,
                    full_name: data.usuario.full_name,
                    email: data.usuario.email
                });
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Error verificando token:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('Respuesta del login:', data);

            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                // Asegúrate de establecer el usuario con la estructura correcta
                setUser({
                    id: data.usuario.id,
                    username: data.usuario.username,
                    full_name: data.usuario.full_name,
                    email: data.usuario.email
                });
                return { success: true };
            } else {
                return { 
                    success: false, 
                    error: data.message || 'Error al iniciar sesión' 
                };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: 'Error de conexión' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: 'Error de conexión' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        register,
        loading
    };

    console.log('Estado actual del contexto:', value); // Depuración

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}; 