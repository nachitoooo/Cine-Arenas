import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '../../app/login-form.css'; // Importación correcta del archivo CSS

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const router = useRouter();

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/csrf/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };
        getCsrfToken();
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', 
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
                console.error('Error logging in:', error.response?.data);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Ingresar</h3>
                </div>
                <div className="card-content">
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
