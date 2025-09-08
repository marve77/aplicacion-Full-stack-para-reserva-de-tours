import React, { useEffect, useState } from 'react';

type Role = string | { name: string };
interface User {
  id: number;
  nombre: string;
  email: string;
  roles: Role[];
}

const initialForm = { nombre: '', email: '', password: '', roles: '' };

interface UsersCrudProps {
  token: string | null;
}

const UsersCrud: React.FC<UsersCrudProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/users', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Error al obtener usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Crear o actualizar usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.nombre.trim() || !form.email.trim()) {
      setError('Nombre y email son obligatorios.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Email no válido.');
      return;
    }
    try {
      const body = {
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        roles: form.roles.split(',').map((r: string) => r.trim()),
      };
      const url = editingId ? `http://localhost:4000/users/${editingId}` : 'http://localhost:4000/users';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Error al guardar usuario');
      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (user: User) => {
    setForm({ nombre: user.nombre, email: user.email, password: '', roles: Array.isArray(user.roles) ? user.roles.map(r => typeof r === 'string' ? r : r.name).join(', ') : '' });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/users/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a192f] py-10 px-2 md:px-8">
      <h2 className="text-2xl font-extrabold mb-6 text-cyan-300 flex items-center gap-2">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z' /><circle cx='12' cy='10' r='3' fill='currentColor' /></svg>
        Gestión de Usuarios
      </h2>
      <button
        className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow-cyan-500/30 shadow-md border border-cyan-400 transition-all"
        onClick={() => { setShowForm(true); setEditingId(null); setForm(initialForm); }}
      >
        Agregar usuario
      </button>
      <div className="overflow-x-auto bg-[#101828] rounded-2xl border-2 border-cyan-400 shadow-cyan-500/40 shadow-lg">
        <table className="min-w-full text-left">
          <thead className="bg-[#0a192f]">
            <tr>
              <th className="py-2 px-4 font-bold text-cyan-300">Nombre</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Email</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Roles</th>
              <th className="py-2 px-4 font-bold text-cyan-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-cyan-900 last:border-b-0 hover:bg-[#0a192f]/60 transition-colors">
                <td className="py-2 px-4 font-semibold text-cyan-200">{user.nombre}</td>
                <td className="py-2 px-4 text-cyan-100">{user.email}</td>
                <td className="py-2 px-4 text-cyan-100">{Array.isArray(user.roles) ? user.roles.map(r => typeof r === 'string' ? r : r.name).join(', ') : ''}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold transition-all" onClick={() => handleEdit(user)}>Editar</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-bold transition-all" onClick={() => handleDelete(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-cyan-700 text-center py-4">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-[#101828] border-2 border-cyan-400 shadow-cyan-500/40 shadow-xl w-96 flex flex-col gap-4 rounded-2xl p-8">
            <h3 className="text-xl font-extrabold mb-2 text-cyan-300 flex items-center gap-2">
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z' /><circle cx='12' cy='10' r='3' fill='currentColor' /></svg>
              {editingId ? 'Editar usuario' : 'Agregar usuario'}
            </h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required={!editingId}
            />
            <input
              type="text"
              name="roles"
              placeholder="Roles (admin,editor)"
              className="border border-cyan-400 bg-[#0a192f] text-cyan-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-400"
              value={form.roles}
              onChange={e => setForm(f => ({ ...f, roles: e.target.value }))}
              required
            />
            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-bold shadow-cyan-500/30 shadow-md border border-cyan-400 flex-1 transition-all">Guardar</button>
              <button type="button" className="bg-gray-700 text-cyan-100 px-4 py-2 rounded-lg hover:bg-gray-600 font-bold flex-1 border border-cyan-400 transition-all" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersCrud;

