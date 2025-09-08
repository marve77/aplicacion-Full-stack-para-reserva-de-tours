import React, { useState } from 'react';


interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
  <form onSubmit={handleSubmit} className="bg-[#16213a] border-2 border-cyan-300 shadow-cyan-400/30 shadow-xl w-96 flex flex-col gap-6 rounded-2xl p-10 mx-auto">
      <h2 className="text-2xl font-extrabold text-center text-cyan-200 flex items-center justify-center gap-2 mb-2">
        <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7 text-cyan-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'><circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2' fill='none'/><circle cx='12' cy='12' r='4' fill='currentColor'/></svg>
        Iniciar sesión
      </h2>
      <input
        type="email"
        placeholder="Correo electrónico"
        className="border border-cyan-300 bg-[#1a233a] text-cyan-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 placeholder-cyan-300 text-base"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border border-cyan-300 bg-[#1a233a] text-cyan-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-300 placeholder-cyan-300 text-base"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-500 text-white py-3 rounded-lg transition-all font-bold shadow-cyan-400/30 shadow-md border border-cyan-300 text-lg"
      >
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
