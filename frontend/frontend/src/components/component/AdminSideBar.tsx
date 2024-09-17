"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { HomeIcon, FilmIcon, PencilIcon, PowerIcon, MenuIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Payment {
  id: number
  amount: string
  status: string
  created_at: string
  user: number | null
  movie: number
  seats: number[]
}

interface AggregatedSalesData {
  date: string
  total_sales: number
  total_tickets: number
  approved_payments: number
  rejected_payments: number
  daily_change?: number
}

export default function AdminSideBar() {
  const router = useRouter()
  const [csrfToken, setCsrfToken] = useState<string>('')
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [salesData, setSalesData] = useState<AggregatedSalesData[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)


  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'))
  }, [])

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf/`, {
          method: 'GET',
          credentials: 'include',
        })
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch (error) {
        console.error('Error fetching CSRF token:', error)
      }
    }

    const getPaymentsData = async () => {
      if (!authToken) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
          },
        })
        const payments: Payment[] = await response.json()
        const aggregatedData = aggregateSalesData(payments)
        setSalesData(aggregatedData)
      } catch (error) {
        console.error('Error fetching payments data:', error)
      }
    }

    getCsrfToken()
    getPaymentsData()
  }, [authToken])

  const aggregateSalesData = (payments: Payment[]): AggregatedSalesData[] => {
    const salesMap: { [date: string]: AggregatedSalesData } = {}
    let cumulativeSales = 0

    payments.forEach(payment => {
      const date = new Date(payment.created_at).toISOString().split('T')[0]

      if (!salesMap[date]) {
        salesMap[date] = {
          date,
          total_sales: 0,
          total_tickets: 0,
          approved_payments: 0,
          rejected_payments: 0,
        }
      }

      if (payment.status === 'approved' || payment.status === 'success') {
        cumulativeSales += parseFloat(payment.amount)
        salesMap[date].total_sales = cumulativeSales
        salesMap[date].total_tickets += payment.seats.length
        salesMap[date].approved_payments += 1
      } else if (payment.status === 'rejected') {
        salesMap[date].rejected_payments += 1
      }
    })

    const sortedData = Object.values(salesMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate daily change
    sortedData.forEach((day, index) => {
      if (index > 0) {
        const prevDay = sortedData[index - 1]
        day.daily_change = ((day.total_sales - prevDay.total_sales) / prevDay.total_sales) * 100
      } else {
        day.daily_change = 0
      }
    })

    return sortedData
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        localStorage.removeItem('authToken')
        router.push('/')
      } else {
        const errorData = await response.json()
        console.error('Error al cerrar sesión:', errorData)
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 rounded shadow-lg border border-gray-700">
          <p className="text-gray-300">{formatDate(label)}</p>
          <p className="text-purple-400 font-bold">{`${payload[0].name}: ${payload[0].value.toFixed(2)}`}</p>
          {payload[0].payload.daily_change !== undefined && (
            <p className={payload[0].payload.daily_change >= 0 ? "text-green-400" : "text-red-400"}>
              {`${payload[0].payload.daily_change >= 0 ? "+" : ""}${payload[0].payload.daily_change.toFixed(2)}%`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-20 bg-gray-800 text-gray-100"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      <aside className={`w-64 p-6 border-r border-gray-800 bg-gray-900 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}>
        <h1 className="text-xl font-bold mb-8 text-purple-400">Panel de administrador</h1>
        <nav className="space-y-6">
          <Link href="/" className="flex items-center py-2 px-4 rounded hover:bg-gray-800 text-gray-300 hover:text-purple-400 transition-colors">
            <HomeIcon className="mr-3 h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <Link href="/create-movie" className="flex items-center py-2 px-4 rounded hover:bg-gray-800 text-gray-300 hover:text-purple-400 transition-colors">
            <FilmIcon className="mr-3 h-5 w-5" />
            <span>Crear película</span>
          </Link>
          <Link href="/edit-movie" className="flex items-center py-2 px-4 rounded hover:bg-gray-800 text-gray-300 hover:text-purple-400 transition-colors">
            <PencilIcon className="mr-3 h-5 w-5" />
            <span>Gestionar películas</span>
          </Link>
          
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-gray-800">
            <PowerIcon className="mr-3 h-5 w-5" />
            <span>Cerrar sesión</span>
          </Button>
        </nav>
      </aside>

      <main className="flex-grow p-4 md:p-8 md:ml-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Ventas Totales</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[200px]">
              {salesData.length === 0 ? (
                <p className="text-gray-400">No hay datos de ventas disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={formatDate} interval={Math.ceil(salesData.length / 5)} stroke="#718096" />
                    <YAxis orientation="right" stroke="#718096" />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#718096" />
                    <Area type="monotone" dataKey="total_sales" stroke="#9F7AEA" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Boletos Vendidos por Día</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[200px]">
              {salesData.length === 0 ? (
                <p className="text-gray-400">No hay datos disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="date" tickFormatter={formatDate} interval={Math.ceil(salesData.length / 5)} stroke="#718096" />
                    <YAxis orientation="right" stroke="#718096" />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#718096" />
                    <Bar dataKey="total_tickets" fill="#9F7AEA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Pagos Aprobados</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[200px]">
              {salesData.length === 0 ? (
                <p className="text-gray-400">No hay datos disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={formatDate} interval={Math.ceil(salesData.length / 5)} stroke="#718096" />
                    <YAxis orientation="right" stroke="#718096" />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#718096" />
                    <Area type="monotone" dataKey="approved_payments" stroke="#9F7AEA" fillOpacity={1} fill="url(#colorApproved)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Pagos Rechazados</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] md:h-[200px]">
              {salesData.length === 0 ? (
                <p className="text-gray-400">No hay datos disponibles</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={formatDate} interval={Math.ceil(salesData.length / 5)} stroke="#718096" />
                    <YAxis orientation="right" stroke="#718096" />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#718096" />
                    <Area type="monotone" dataKey="rejected_payments" stroke="#9F7AEA" fillOpacity={1} fill="url(#colorRejected)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}