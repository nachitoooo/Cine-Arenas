import Link from "next/link";
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AdminNavigation = () => {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/csrf/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    getCsrfToken();

    // Only access localStorage on the client side
    setAuthToken(localStorage.getItem('authToken'));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Token ${authToken}`,  // Envía el token de autenticación en la cabecera
        },
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('authToken'); // Elimina el token del almacenamiento local
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error al cerrar sesión:', errorData);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-gray-800 shadow-lg p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-white text-2xl font-bold"> Cine arenas - Panel de administrador</Link>
        <div className="flex space-x-4">
          <Link href="/create-movie" className="text-white hover:text-gray-400">Crear Película</Link>
          <Link href="/edit-movie" className="text-white hover:text-gray-400">Editar / ver películas </Link>
          <Link href="/" className="text-white hover:text-gray-400">Volver al sitio</Link>
          <button onClick={handleLogout} className="text-white hover:text-gray-400">Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
