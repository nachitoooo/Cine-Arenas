import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import { FaPowerOff, FaHome, FaFilm, FaEdit, FaBars } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";

interface NavItemsProps {
  navItemClasses: string;
  handleLogout: () => void;
}

const AdminNavigation: React.FC = () => {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
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
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-bold">Panel de administrador</Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white lg:hidden"
          >
            <FaBars size={24} />
          </button>
          <div className="hidden lg:flex space-x-4">
            <NavItems navItemClasses={navItemClasses} handleLogout={handleLogout} />
          </div>
        </div>
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <NavItems navItemClasses={navItemClasses} handleLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
};

const NavItems: React.FC<NavItemsProps> = ({ navItemClasses, handleLogout }) => (
  <div className="flex flex-col lg:flex-row lg:items-center">
    <Link href="/" className={navItemClasses}>
      <FaHome className="mr-1" /> Inicio
    </Link>
    <Link href="/create-movie" className={navItemClasses}>
      <FaFilm className="mr-1" /> Crear película
    </Link>
    <Link href="/edit-movie" className={navItemClasses}>
      <FaEdit className="mr-1" /> Gestionar películas
    </Link>
    <Link href="/admin" className={navItemClasses}>
      <GrUserAdmin className="mr-1" /> Acceder al panel de administrador
    </Link>
    <button onClick={handleLogout} className={`${navItemClasses} bg-red-400 hover:bg-red-700`}>
      <FaPowerOff className="mr-1" /> Cerrar sesión
    </button>
  </div>
);

export default AdminNavigation;