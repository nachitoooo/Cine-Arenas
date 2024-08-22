import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { HomeIcon, FilmIcon, PencilIcon, PowerIcon } from 'lucide-react';

interface Payment {
  id: number;
  amount: string;
  status: string;
  created_at: string;
  user: number | null;
  movie: number;
  seats: number[];
}

interface AggregatedSalesData {
  date: string;
  total_sales: number;
  total_tickets: number;
  approved_payments: number;
  rejected_payments: number;
}

const AdminSideBar: React.FC = () => {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<AggregatedSalesData[]>([]);

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
  }, []);

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/csrf/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    const getPaymentsData = async () => {
      if (!authToken) return;

      try {
        const response = await fetch('http://localhost:8000/api/payments/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        });
        const payments: Payment[] = await response.json();
        const aggregatedData = aggregateSalesData(payments);
        setSalesData(aggregatedData);
      } catch (error) {
        console.error('Error fetching payments data:', error);
      }
    };

    getCsrfToken();
    getPaymentsData();
  }, [authToken]);

  const aggregateSalesData = (payments: Payment[]): AggregatedSalesData[] => {
    const salesMap: { [date: string]: AggregatedSalesData } = {};
    let cumulativeSales = 0;

    payments.forEach(payment => {
      const date = new Date(payment.created_at).toISOString().split('T')[0];

      if (!salesMap[date]) {
        salesMap[date] = {
          date,
          total_sales: 0,
          total_tickets: 0,
          approved_payments: 0,
          rejected_payments: 0,
        };
      }

      if (payment.status === 'approved' || payment.status === 'success') {
        cumulativeSales += parseFloat(payment.amount);
        salesMap[date].total_sales = cumulativeSales;
        salesMap[date].total_tickets += payment.seats.length;
        salesMap[date].approved_payments += 1;
      } else if (payment.status === 'rejected') {
        salesMap[date].rejected_payments += 1;
      }
    });

    return Object.values(salesMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

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

  const navItemClasses = 'text-white hover:text-gray-400 flex items-center py-2 px-4 rounded';

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
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

      <main className="flex-grow p-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ventas Totales</h3>
            <div>
              {salesData.length === 0 ? (
                <p>No hay datos de ventas disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#b15eff" />
                    <XAxis dataKey="date" stroke="#b15eff" />
                    <YAxis stroke="#b15eff" />
                    <Tooltip />
                    <Line 
                      type="basis" 
                      dataKey="total_sales" 
                      stroke="#b15eff" 
                      strokeWidth={3} 
                      dot={false} 
                      style={{ filter: 'drop-shadow(0 0 5px #b15eff)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Boletos Vendidos por Día</h3>
            <div>
              {salesData.length === 0 ? (
                <p>No hay datos disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#b15eff" />
                    <XAxis dataKey="date" stroke="#b15eff" />
                    <YAxis stroke="#b15eff" />
                    <Tooltip />
                    <Bar dataKey="total_tickets" fill="#b15eff" style={{ filter: 'drop-shadow(0 0 5px #b15eff)' }} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Pagos Aprobados</h3>
            <div>
              {salesData.length === 0 ? (
                <p>No hay datos disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#b15eff" />
                    <XAxis dataKey="date" stroke="#b15eff" />
                    <YAxis stroke="#b15eff" />
                    <Tooltip />
                    <Line 
                      type="basis" 
                      dataKey="approved_payments" 
                      stroke="#b15eff" 
                      strokeWidth={3} 
                      dot={false} 
                      style={{ filter: 'drop-shadow(0 0 5px #b15eff)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Pagos Rechazados</h3>
            <div>
              {salesData.length === 0 ? (
                <p>No hay datos disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#b15eff" />
                    <XAxis dataKey="date" stroke="#b15eff" />
                    <YAxis stroke="#b15eff" />
                    <Tooltip />
                    <Line 
                      type="basis" 
                      dataKey="rejected_payments" 
                      stroke="#b15eff" 
                      strokeWidth={3} 
                      dot={false} 
                      style={{ filter: 'drop-shadow(0 0 5px #b15eff)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSideBar;
