import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import { FaPowerOff, FaHome, FaFilm, FaEdit } from "react-icons/fa"; 
import { createChart, IChartApi } from 'lightweight-charts';
import { HomeIcon, FilmIcon, PencilIcon, PowerIcon } from 'lucide-react'

interface SalesData {
  labels: string[];
  total_sales: number[];
  total_tickets: number[];
}

const AdminSideBar: React.FC = () => {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<SalesData>({ labels: [], total_sales: [], total_tickets: [] });

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

    const getSalesData = async () => {
      try {
        const response = await fetch('http://localhost:8000/sales-stats/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,  // Envía el token de autenticación en la cabecera
          },
        });
        const data: SalesData = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    getCsrfToken();
    getSalesData();

    setAuthToken(localStorage.getItem('authToken'));
  }, [authToken]);

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

  useEffect(() => {
    if (salesData.labels.length > 0) {
      const chartContainer = document.getElementById('sales-chart');
      if (chartContainer) {
        const chart: IChartApi = createChart(chartContainer, { width: 400, height: 300 });
        const lineSeries = chart.addLineSeries();

        const data = salesData.labels.map((label: string, index: number) => ({
          time: label,
          value: salesData.total_sales[index],
        }));

        lineSeries.setData(data);
      }
    }
  }, [salesData]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-8">Cine Arenas</h2>
        <nav className="space-y-6">
          <Link href="/" className={navItemClasses}>
            <HomeIcon className="mr-3 h-5 w-5" /> 
            <span>Inicio</span>
          </Link>
          <Link href="/create-movie" className={navItemClasses}>
            <FilmIcon className="mr-3 h-5 w-5" /> 
            <span>Crear película</span>
          </Link>
          <Link href="/edit-movie" className={navItemClasses}>
            <PencilIcon className="mr-3 h-5 w-5" /> 
            <span>Gestionar películas</span>
          </Link>
          <button onClick={handleLogout} className={`${navItemClasses} text-red-400 hover:text-red-300`}>
            <PowerIcon className="mr-3 h-5 w-5" /> 
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ventas Diarias</h3>
            <div className="h-40 bg-gray-700 rounded"></div>  
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Películas Populares</h3>
            <div className="h-40 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Resumen Mensual</h3>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </main>
    </div>
  )
}

export default AdminSideBar;
