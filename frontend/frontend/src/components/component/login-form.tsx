import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import '../../app/login-form.css'; // Importación correcta del archivo CSS

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`); // Usar variable de entorno
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        getCsrfToken();
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');  
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/`, // Usar variable de entorno
                { username, password },
                { 
                    headers: { 
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            console.log(response.data);
            localStorage.setItem('authToken', response.data.token);
            router.push('/admin');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.error || 'Credenciales inválidas. Por favor, contacte a el administrador');
            } else {
                setErrorMessage('Credenciales inválidas. Por favor, contacte a el administrador');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Panel de administrador</h3>
                </div>
                <div className="card-content">
                    {errorMessage && (
                        <div className="alert">
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Usuario - Administrador</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                placeholder="Usuario"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Contraseña"
                                required
                            />
                        </div>
                        
                        <div className="form-footer">
                            <button type="submit" className="form-button">Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
