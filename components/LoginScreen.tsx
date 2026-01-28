import React, { useState } from 'react';
import { Wallet, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Visual */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/30">
              <Wallet className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Rafatec Gastos</h1>
            <p className="text-blue-100 text-sm">Gerencie suas finanças com inteligência</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Bem-vindo de volta!</h2>
            <p className="text-gray-500 text-sm mt-1">Identifique-se para acessar seus dados.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Seu Nome ou Usuário
              </label>
              <input
                id="username"
                type="text"
                placeholder="Ex: Rafael"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 transition-all placeholder:text-gray-400"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Acessar Painel 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            <span>Seus dados são salvos neste dispositivo.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;