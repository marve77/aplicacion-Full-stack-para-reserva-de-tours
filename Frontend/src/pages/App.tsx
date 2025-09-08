
import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import Sidebar from '../components/Sidebar';
import UsersCrud from './UsersCrud';
import ToursCrud from './ToursCrud';
import Dashboard from './Dashboard';
import ReservationsCrud from './ReservationsCrud';
import EditorReservations from './EditorReservations';
import { login } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

const App: React.FC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const { isAuthenticated, user, token, login: loginStore, logout: logoutStore } = useAuthStore();
  const [section, setSection] = useState<string>('dashboard');

  const handleLogin = async (email: string, password: string) => {
    setError(undefined);
    try {
      const result = await login(email, password);
      loginStore(result.user, result.access_token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logoutStore();
    setSection('dashboard');
  };

  const isAdmin = user && Array.isArray(user.roles) && user.roles.includes('admin');
  const isEditor = user && Array.isArray(user.roles) && user.roles.includes('editor');
  if (isAuthenticated && user) {
    if (isEditor && !isAdmin) {
      // Vista privada para editores
      return (
  <div className="min-h-screen bg-[#0a192f]">
          <div className="fixed left-0 top-0 h-screen w-64 z-20">
            <Sidebar onSelect={setSection} selected={section} user={user} onLogout={handleLogout} />
          </div>
          <div className="ml-64 h-screen flex flex-col">
            <header className="bg-[#101828] shadow-cyan-500/20 shadow flex items-center px-8 h-20 border-b-2 border-cyan-400">
              <h1 className="text-3xl font-extrabold text-cyan-300 tracking-wide flex items-center gap-2">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none'/><circle cx='12' cy='12' r='4' fill='currentColor'/></svg>
                Bienvenido
              </h1>
            </header>
            <main className="flex-1 p-8 overflow-y-auto">
              <EditorReservations token={token} />
            </main>
          </div>
        </div>
      );
    }
    if (isAdmin) {
      return (
  <div className="min-h-screen bg-[#0a192f]">
          {/* Sidebar fijo */}
          <div className="fixed left-0 top-0 h-screen w-64 z-20">
            <Sidebar onSelect={setSection} selected={section} user={user} onLogout={handleLogout} />
          </div>
          {/* Contenido principal con margen izquierdo y scroll independiente */}
          <div className="ml-64 h-screen flex flex-col">
            <header className="bg-[#101828] shadow-cyan-500/20 shadow flex items-center px-8 h-20 border-b-2 border-cyan-400">
              <h1 className="text-3xl font-extrabold text-cyan-300 tracking-wide flex items-center gap-2">
                <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8 text-cyan-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none'/><circle cx='12' cy='12' r='4' fill='currentColor'/></svg>
                Bienvenido
              </h1>
            </header>
            <main className="flex-1 p-8 overflow-y-auto">
              {section === 'dashboard' && (
                <Dashboard token={token} />
              )}
              {section === 'tours' && <ToursCrud token={token} />}
              {section === 'users' && <UsersCrud token={token} />}
              {section === 'reservations' && <ReservationsCrud token={token} />}
            </main>
          </div>
        </div>
      );
    }
    // Si no es admin ni editor, acceso denegado
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
        <div className="bg-[#101828] p-8 rounded-2xl shadow-cyan-500/30 shadow-xl text-center border-2 border-cyan-400">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Acceso denegado</h2>
          <p className="text-cyan-200">No tienes permisos para acceder a esta sección.</p>
          <button
            className="mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-400 font-bold border border-cyan-400 shadow-cyan-500/30 shadow-md"
            onClick={handleLogout}
          >Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
      <LoginForm onLogin={handleLogin} error={error} />
    </div>
  );
};

export default App;
