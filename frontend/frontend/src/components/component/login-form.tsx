import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <form onSubmit={handleLogin}>
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="mt-1"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="mt-1"
                />
            </div>
            <div className="flex items-center justify-between">
                <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Login
                </Button>
            </div>
        </form>
    );
};

export default LoginForm;
