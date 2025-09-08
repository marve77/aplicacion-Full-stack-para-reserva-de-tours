import React, { useEffect, useState } from 'react';

interface Reservation {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  tour: { id: number; destino: string };
  cantidad: number;
}

interface Tour {
  id: number;
  destino: string;
}

const ReservationsCrud: React.FC<{ token: string | null }> = ({ token }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    tour: '',
    cantidad: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:4000/reservations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setReservations(data));
    fetch('http://localhost:4000/tours', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTours(data));
  }, [token, showModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.nombre || !form.telefono || !form.correo || !form.tour || !form.cantidad) {
      setError('Todos los campos son obligatorios');
      return;
    }
    const body = {
      nombre: form.nombre,
      telefono: form.telefono,
      correo: form.correo,
      tour: Number(form.tour),
      cantidad: Number(form.cantidad),
    };
    try {
      const res = await fetch(`http://localhost:4000/reservations${editing ? '/' + editing.id : ''}`, {
        method: editing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar la reservación');
      setShowModal(false);
      setEditing(null);
      setForm({ nombre: '', telefono: '', correo: '', tour: '', cantidad: 1 });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setEditing(reservation);
    setForm({
      nombre: reservation.nombre,
      telefono: reservation.telefono,
      correo: reservation.correo,
      tour: reservation.tour.id.toString(),
      cantidad: reservation.cantidad,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta reservación?')) return;
    await fetch(`http://localhost:4000/reservations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setReservations(reservations.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen w-full bg-[#0a192f] py-10 px-2 md:px-8">
      <h2 className="text-2xl font-extrabold mb-6 text-cyan-300 flex items-center gap-2">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 018 0v2M12 7a4 4 0 110 8 4 4 0 010-8z' /></svg>
        Gestión de Reservaciones
      </h2>
      <button
        className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow-cyan-500/30 shadow-md border border-cyan-400 transition-all"
        onClick={() => { setShowModal(true); setEditing(null); setForm({ nombre: '', telefono: '', correo: '', tour: '', cantidad: 1 }); }}
      >
        Nueva reservación
      </button>
      <div className="overflow-x-auto bg-[#101828] rounded-2xl border-2 border-cyan-400 shadow-cyan-500/40 shadow-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#0a192f]">
            <tr>
              <th className="py-2 px-4 font-bold text-cyan-300">Nombre</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Teléfono</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Correo</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Tour</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Cantidad</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(r => (
              <tr key={r.id} className="border-b border-cyan-900 last:border-b-0 hover:bg-[#0a192f]/60 transition-colors">
                <td className="py-2 px-4 text-cyan-200">{r.nombre}</td>
                <td className="py-2 px-4 text-cyan-200">{r.telefono}</td>
                <td className="py-2 px-4 text-cyan-200">{r.correo}</td>
                <td className="py-2 px-4 text-cyan-200">{r.tour?.destino}</td>
                <td className="py-2 px-4 text-cyan-200">{r.cantidad}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold transition-all" onClick={() => handleEdit(r)}>Editar</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-bold transition-all" onClick={() => handleDelete(r.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="text-cyan-700 text-center py-4">No hay reservaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#101828] border-2 border-cyan-400 shadow-cyan-500/40 shadow-xl w-96 flex flex-col gap-4 rounded-2xl p-8 relative">
            <button className="absolute top-2 right-2 text-cyan-400 hover:text-cyan-200 text-2xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-xl font-extrabold mb-2 text-cyan-300 flex items-center gap-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 17v-2a4 4 0 018 0v2M12 7a4 4 0 110 8 4 4 0 010-8z' /></svg>
              {editing ? 'Editar' : 'Nueva'} reservación
            </h3>
            {error && <div className="mb-2 text-red-400 font-semibold text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                className="w-full border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                className="w-full border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
                value={form.telefono}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="correo"
                placeholder="Correo"
                className="w-full border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
                value={form.correo}
                onChange={handleChange}
                required
              />
              <select
                name="tour"
                className="w-full border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
                value={form.tour}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un tour</option>
                {tours.map(t => (
                  <option key={t.id} value={t.id}>{t.destino}</option>
                ))}
              </select>
              <input
                type="number"
                name="cantidad"
                placeholder="Cantidad de personas"
                className="w-full border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
                value={form.cantidad}
                min={1}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-2 rounded-lg font-bold shadow-cyan-500/30 shadow-md border border-cyan-400 transition-all"
              >
                {editing ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsCrud;
