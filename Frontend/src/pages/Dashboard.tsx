import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
// ...eliminar importación de datalabels...
import { getReservations } from '../services/reservationsService';
import { getWeeklyEarnings } from '../services/weeklyEarningsService';

interface Tour {
  id: number;
  nombre: string;
  destino: string;
  descripcion: string;
  precio: number;
  fecha_inicio: string;
}

const Dashboard: React.FC<{ token: string | null }> = ({ token }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [earningsByTour, setEarningsByTour] = useState<{ [tourId: number]: number }>({});

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:4000/tours', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTours(data));
    getReservations(token)
      .then(data => setReservations(data))
      .catch(() => setReservations([]));
    // fetch('/api/users/count', {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(res => res.json())
    //   .then(data => setUserCount(data.count));

    getWeeklyEarnings(token)
      .then(data => {
        setWeeklyEarnings(data.earnings);
        // Calcular ganancias por tour
        if (Array.isArray(data.byTour)) {
          const byTour: { [tourId: number]: number } = {};
          data.byTour.forEach((item: { tourId: number, earnings: number }) => {
            byTour[item.tourId] = item.earnings;
          });
          setEarningsByTour(byTour);
        }
      })
      .catch(() => setWeeklyEarnings(0));
  }, [token]);


  // Calcular cantidad de personas por tour
  const personasPorTour = tours.map(tour => {
    const total = reservations
      .filter(r => r.tour && r.tour.id === tour.id)
      .reduce((sum, r) => sum + (r.cantidad || 0), 0);
    return total;
  });

  const tourPieData = {
    labels: tours.map(t => t.destino),
    datasets: [
      {
        data: personasPorTour,
        backgroundColor: [
          '#4F46E5', '#10B981', '#F59E42', '#EF4444', '#6366F1', '#FBBF24', '#3B82F6', '#A21CAF', '#14B8A6', '#F472B6'
        ],
      },
    ],
  };

  // Gráfico de ganancias por tour
  const earningsPieData = {
    labels: tours.map(t => t.destino),
    datasets: [
      {
        data: tours.map(t => earningsByTour[t.id] || 0),
        backgroundColor: [
          '#4F46E5', '#10B981', '#F59E42', '#EF4444', '#6366F1', '#FBBF24', '#3B82F6', '#A21CAF', '#14B8A6', '#F472B6'
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-[#0a192f] py-10 px-2 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tarjeta Personas por tour */}
        <div className="rounded-2xl border-2 border-cyan-400 shadow-cyan-500/40 shadow-xl bg-[#101828] p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-4 text-cyan-300 drop-shadow-glow">
            {/* Icono de usuarios */}
            <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6.13a4 4 0 11-8 0 4 4 0 018 0z' /></svg>
            Personas por tour
          </h2>
          <div className="w-64 h-64">
            <Pie
              data={{
                ...tourPieData,
                datasets: [
                  {
                    ...tourPieData.datasets[0],
                    backgroundColor: [
                      '#00fff7', '#00b4ff', '#0ff', '#1de9b6', '#00e5ff', '#18ffff', '#64ffda', '#00bcd4', '#2196f3', '#2979ff'
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: '#00fff7', font: { size: 16, weight: 'bold' } },
                  },
                },
              }}
            />
          </div>
          <div className="mt-6 text-2xl font-extrabold text-white">Total personas: <span className="text-cyan-400">{personasPorTour.reduce((a, b) => a + b, 0)}</span></div>
        </div>
        {/* Tarjeta Ganancias */}
        <div className="rounded-2xl border-2 border-cyan-400 shadow-cyan-500/40 shadow-xl bg-[#101828] p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold mb-4 text-cyan-300 drop-shadow-glow">
            {/* Icono de dinero */}
            <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4' /></svg>
            Ganancias de la semana
          </h2>
          <div className="w-64 h-64">
            <Pie
              data={{
                ...earningsPieData,
                datasets: [
                  {
                    ...earningsPieData.datasets[0],
                    backgroundColor: [
                      '#00fff7', '#00b4ff', '#0ff', '#1de9b6', '#00e5ff', '#18ffff', '#64ffda', '#00bcd4', '#2196f3', '#2979ff'
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                    labels: { color: '#00fff7', font: { size: 16, weight: 'bold' } },
                  },
                },
              }}
            />
          </div>
          <div className="mt-6 text-2xl font-extrabold text-white">Total: <span className="text-cyan-400">${weeklyEarnings}</span></div>
        </div>
      </div>

      {/* Acciones recientes en tabla con scroll */}
      <div className="mt-12">
        <h2 className="text-2xl font-extrabold mb-4 text-cyan-300 flex items-center gap-2">
          <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 014-4h4m0 0V7m0 4h-4' /></svg>
          Acciones recientes
        </h2>
        <div className="overflow-y-auto max-h-80 border-2 border-cyan-400 rounded-xl shadow-cyan-500/40 shadow-lg bg-[#101828]/80">
          <table className="min-w-full text-left">
            <thead className="bg-[#0a192f] sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 font-bold text-cyan-300">Usuario</th>
                <th className="py-2 px-4 font-bold text-cyan-300">Acción</th>
                <th className="py-2 px-4 font-bold text-cyan-300">Tour</th>
              </tr>
            </thead>
            <tbody>
              {reservations.slice().reverse().map((r, idx) => (
                <tr key={idx} className="border-b border-cyan-900 last:border-b-0 hover:bg-[#0a192f]/60 transition-colors">
                  <td className="py-2 px-4 text-cyan-200 font-semibold">{r.user?.nombre || r.nombre}</td>
                  <td className="py-2 px-4 text-cyan-100">realizó una reservación</td>
                  <td className="py-2 px-4 font-semibold text-cyan-300">{r.tour?.destino || r.tour?.nombre || 'Tour'}</td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-cyan-700 text-center py-4">No hay acciones recientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
