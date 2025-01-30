import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import MindfulBreathingApp from './components/MindfulBreathingApp';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    //console.log('PrivateRoute - Usuario:', user, 'Cargando:', loading); // Depuración

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        //console.log('No hay usuario, redirigiendo a login...'); // Depuración
        return <Navigate to="/login" replace />;
    }

    //console.log('Usuario autenticado, mostrando contenido protegido'); // Depuración
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/app" 
                        element={
                            <PrivateRoute>
                                <MindfulBreathingApp />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;