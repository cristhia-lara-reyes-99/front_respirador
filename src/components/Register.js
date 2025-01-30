import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        last_name: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        const { confirmPassword, ...registerData } = formData;
        const result = await register(registerData);

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Crear cuenta
                    </h2>
                    <p className="text-gray-500 text-lg">Comienza tu viaje con nosotros</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-red-600 text-sm">{error}</span>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        {[
                            { name: 'username', type: 'text', placeholder: 'Usuario' },
                            { name: 'full_name', type: 'text', placeholder: 'Nombre completo' },
                            { name: 'last_name', type: 'text', placeholder: 'Apellidos' },
                            { name: 'age', type: 'number', placeholder: 'Edad', min: 1 },
                            { name: 'email', type: 'email', placeholder: 'Correo electrónico' },
                        ].map((field, index) => (
                            <input
                                key={field.name}
                                name={field.name}
                                type={field.type}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={handleChange}
                                min={field.min}
                            />
                        ))}

                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-500"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6.58 6.58a9.953 9.953 0 00-1.563 3.029C5.732 14.057 9.522 17 12 17c.716 0 1.41-.087 2.075-.25M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                                placeholder="Confirmar contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${
                                        passwordStrength === 0 ? 'bg-red-500' :
                                        passwordStrength <= 2 ? 'bg-yellow-400' :
                                        'bg-green-500'
                                    }`}
                                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                                {passwordStrength === 0 && "La contraseña es muy débil"}
                                {passwordStrength === 1 && "La contraseña es débil"}
                                {passwordStrength === 2 && "La contraseña es moderada"}
                                {passwordStrength === 3 && "La contraseña es fuerte"}
                                {passwordStrength === 4 && "La contraseña es muy fuerte"}
                            </p>
                            <p className="text-xs text-gray-400 italic">
                                Sugerencia: Usa mayúsculas, números y caracteres especiales
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
                            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Registrando...</span>
                            </div>
                        ) : (
                            'Registrarse'
                        )}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta? {' '}
                        <Link 
                            to="/login" 
                            className="font-semibold text-blue-600 hover:text-blue-500 underline transition-colors"
                        >
                            Inicia sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;