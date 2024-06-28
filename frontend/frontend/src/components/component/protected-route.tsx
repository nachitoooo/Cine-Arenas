import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        // Usamos el endpoint de películas para verificar la autenticación
        await axios.get('http://localhost:8000/api/movies/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('authToken'); // Eliminamos el token si no es válido
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return <>{children}</>;
};

export default ProtectedRoute;