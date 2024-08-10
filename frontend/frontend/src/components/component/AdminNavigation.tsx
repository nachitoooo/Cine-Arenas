import Link from "next/link";
import 'tailwindcss/tailwind.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaPowerOff, FaHome, FaFilm, FaEdit } from "react-icons/fa"; 

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

  const navItemClasses = "text-white hover:text-gray-400 flex items-center py-2 px-4 rounded";

  return (
    <nav className="bg-[#111827] shadow-lg p-4 rounded-sm">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-white text-2xl font-bold">Cine arenas - Panel de administrador</Link>
        <div className="flex space-x-4">
          <Link href="/" className={navItemClasses}>
            <FaHome className="mr-1" /> Inicio
          </Link>
          <Link href="/create-movie" className={navItemClasses}>
            <FaFilm className="mr-1" /> Crear película
          </Link>
          <Link href="/edit-movie" className={navItemClasses}>
            <FaEdit className="mr-1" /> Gestionar películas
          </Link>
          <button onClick={handleLogout} className={`${navItemClasses} bg-red-400 hover:bg-red-700 `}>
            <FaPowerOff className="mr-1" /> Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
