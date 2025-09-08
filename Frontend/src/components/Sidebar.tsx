import React from 'react';


interface SidebarProps {
  onSelect: (section: string) => void;
  selected: string;
  user: { nombre: string; email: string; roles?: string[] };
  onLogout: () => void;
}


function getSidebarOptions(user: { roles?: string[] }) {
  const isAdmin = user.roles && user.roles.includes('admin');
  const isEditor = user.roles && user.roles.includes('editor');
  if (isEditor && !isAdmin) {
    return [
      { key: 'reservations', label: 'Gestión de Reservaciones' },
    ];
  }
  // Admin o cualquier otro rol
  return [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'tours', label: 'Gestión de Tours' },
    { key: 'users', label: 'Gestión de Usuarios' },
    { key: 'reservations', label: 'Gestión de Reservaciones' },
  ];
}


const Sidebar: React.FC<SidebarProps> = ({ onSelect, selected, user, onLogout }) => {
  return (
  <aside className="h-screen w-64 bg-[#101828] text-cyan-100 flex flex-col py-8 px-4 shadow-cyan-500/40 shadow-2xl border-r-2 border-cyan-400 rounded-r-3xl">
      <div className="flex flex-col items-center mb-10">
          <div className="bg-[#0a192f] text-cyan-400 rounded-full p-2 mb-2 shadow-cyan-500/40 shadow-lg border-2 border-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
            <circle cx="12" cy="10" r="3" fill="currentColor" />
          </svg>
        </div>
          <div className="text-lg font-bold text-cyan-200 drop-shadow-glow">{user.nombre}</div>
        <div className="text-xs text-blue-200">{user.email}</div>
        {user.roles && user.roles.length > 0 && (
          <div className="text-xs mt-1 px-2 py-1 bg-blue-900 rounded-full text-blue-100 font-semibold">{user.roles[0]}</div>
        )}
      </div>
      <hr className="border-blue-400 mb-6" />
        <h2 className="text-xl font-extrabold mb-6 text-center tracking-wide text-cyan-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7" /></svg>
          Panel
        </h2>
      <nav className="flex flex-col gap-3 flex-1">
        {getSidebarOptions(user).map(opt => (
          <button
            key={opt.key}
            className={`text-left px-4 py-2 rounded-lg transition-all font-medium text-base border border-transparent ${selected === opt.key ? 'bg-[#0a192f] border-cyan-400 shadow-cyan-500/30 shadow-md text-cyan-300' : 'hover:bg-[#0a192f] hover:border-cyan-400 hover:text-cyan-200'}`}
            onClick={() => onSelect(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </nav>
      <button
        onClick={onLogout}
          className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-2 rounded-lg transition-all shadow-cyan-500/30 shadow-md border border-cyan-400"
      >
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
