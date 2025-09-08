import React, { useEffect, useState } from 'react';

interface Tour {
  id: number;
  nombre: string;
  destino: string;
  descripcion: string;
  precio: number;
  fecha_inicio: string;
}

const initialForm = { nombre: '', destino: '', descripcion: '', precio: '', fecha_inicio: '' };

interface ToursCrudProps {
  token: string | null;
}

const ToursCrud: React.FC<ToursCrudProps> = ({ token }) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch tours
  const fetchTours = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/tours', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Error al obtener tours');
      const data = await res.json();
      setTours(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
    const interval = setInterval(fetchTours, 5000);
    return () => clearInterval(interval);
  }, []);

  // Crear o actualizar tour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validación frontend
    if (!form.nombre.trim() || !form.destino.trim() || !form.descripcion.trim() || !form.fecha_inicio.trim()) {
      setError('Nombre, destino, descripción y fecha de inicio son obligatorios.');
      return;
    }
    const precioNum = Number(form.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError('El precio debe ser un número mayor a 0.');
      return;
    }
    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `http://localhost:4000/tours/${editingId}`
        : 'http://localhost:4000/tours';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nombre: form.nombre,
          destino: form.destino,
          descripcion: form.descripcion,
          precio: precioNum,
          fecha_inicio: form.fecha_inicio,
        }),
      });
      if (!res.ok) throw new Error('Error al guardar tour');
      setForm(initialForm);
      setEditingId(null);
      fetchTours();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Editar tour
  const handleEdit = (tour: Tour) => {
    setForm({
      nombre: tour.nombre,
      destino: tour.destino,
      descripcion: tour.descripcion,
      precio: String(tour.precio),
      fecha_inicio: tour.fecha_inicio ? tour.fecha_inicio.substring(0, 10) : '',
    });
    setEditingId(tour.id);
    setShowForm(true);
  };

  const handleCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
  };

  // Eliminar tour
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar tour?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/tours/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Error al eliminar tour');
      fetchTours();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a192f] py-10 px-2 md:px-8">
      <h2 className="text-2xl font-extrabold mb-6 text-cyan-300 flex items-center gap-2">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1M16.95 7.05l-.707.707M7.757 16.243l-.707.707M16.95 16.95l-.707-.707M7.757 7.757l-.707-.707' /><circle cx='12' cy='12' r='4' fill='currentColor' /></svg>
        Gestión de Tours
      </h2>
      <button
        className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow-cyan-500/30 shadow-md border border-cyan-400 transition-all"
        onClick={handleCreate}
      >
        Agregar tour
      </button>
      <div className="overflow-x-auto bg-[#101828] rounded-2xl border-2 border-cyan-400 shadow-cyan-500/40 shadow-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#0a192f]">
            <tr>
              <th className="py-2 px-4 font-bold text-cyan-300">ID</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Nombre</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Destino</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Fecha inicio</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Descripción</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Precio</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.id} className="border-b border-cyan-900 last:border-b-0 hover:bg-[#0a192f]/60 transition-colors">
                <td className="py-2 px-4 text-cyan-200">{tour.id}</td>
                <td className="py-2 px-4 text-cyan-200">{tour.nombre}</td>
                <td className="py-2 px-4 text-cyan-200">{tour.destino}</td>
                <td className="py-2 px-4 text-cyan-200">{tour.fecha_inicio}</td>
                <td className="py-2 px-4 text-cyan-200">{tour.descripcion}</td>
                <td className="py-2 px-4 text-cyan-200">{typeof tour.precio === 'number' ? `$${tour.precio.toFixed(2)}` : `$${Number(tour.precio).toFixed(2)}`}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold transition-all" onClick={() => handleEdit(tour)}>Editar</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-bold transition-all" onClick={() => handleDelete(tour.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr>
                <td colSpan={7} className="text-cyan-700 text-center py-4">No hay tours registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-[#101828] border-2 border-cyan-400 shadow-cyan-500/40 shadow-xl w-96 flex flex-col gap-4 rounded-2xl p-8">
            <h3 className="text-xl font-extrabold mb-2 text-cyan-300 flex items-center gap-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1M16.95 7.05l-.707.707M7.757 16.243l-.707.707M16.95 16.95l-.707-.707M7.757 7.757l-.707-.707' /><circle cx='12' cy='12' r='4' fill='currentColor' /></svg>
              {editingId ? 'Editar tour' : 'Agregar tour'}
            </h3>
            <input
              type="text"
              placeholder="Nombre"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Destino"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.destino}
              onChange={e => setForm(f => ({ ...f, destino: e.target.value }))}
              required
            />
            <input
              type="date"
              placeholder="Fecha de inicio"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.fecha_inicio}
              onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Descripción"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.descripcion}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Precio"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.precio}
              onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
              required
              step={100}
              min={0}
            />
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow-cyan-500/30 shadow-md border border-cyan-400 flex-1 transition-all">Guardar</button>
              <button type="button" className="bg-gray-700 text-cyan-100 px-4 py-2 rounded-lg hover:bg-gray-600 font-bold flex-1 border border-cyan-400 transition-all" onClick={() => { setForm(initialForm); setEditingId(null); setShowForm(false); }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ToursCrud;
