'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const shouldOpenLogin = searchParams.get('login') === '1';
    const reason = searchParams.get('reason');

    if (shouldOpenLogin) {
      setShowAdminLogin(true);
    }

    if (reason === 'no-permission') {
      setLoginError('Você não tem permissão para acessar esta página. Faça login como admin.');
    }
  }, [searchParams]);

  const handlePDVAccess = () => {
    router.push('/cart');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const success = await login(adminEmail, adminPassword, 'admin');
      if (success) {
        setShowAdminLogin(false);
        router.push('/products');
      } else {
        setLoginError('Credenciais inválidas ou usuário sem permissão de admin');
      }
    } catch (err) {
      setLoginError('Erro ao fazer login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo e Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            Auto Car Sul
          </h1>
          <p className="text-slate-400 text-base md:text-xl">Sistema de gestão para oficina mecânica no GTA RP</p>
        </div>

        {/* Opções de Acesso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* PDV - Acesso Direto */}
          <div className="bg-slate-800 border border-cyan-500/40 p-8 rounded-xl hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer" onClick={handlePDVAccess}>
            <div className="text-center">
              <div className="text-6xl mb-6">🧾</div>
              <h2 className="text-3xl font-bold mb-4 text-white">PDV (Usuário)</h2>
              <p className="text-cyan-300 mb-6 text-lg">Ponto de Venda Operacional</p>
              <p className="text-slate-400 text-sm">Acesso de usuário comum ao sistema de vendas</p>
            </div>
          </div>

          {/* Admin - Login Requerido */}
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer" onClick={() => setShowAdminLogin(true)}>
            <div className="text-center">
              <div className="text-6xl mb-6">⚙️</div>
              <h2 className="text-3xl font-bold mb-4 text-white">Admin</h2>
              <p className="text-slate-400 mb-6 text-lg">Acesso Administrativo</p>
              <p className="text-slate-500 text-sm">Gerenciamento completo do sistema</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-slate-900/70 border border-slate-700 rounded-xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-white font-semibold">Acesso de usuário comum</p>
              <p className="text-slate-400 text-sm">Usuários não-admin podem usar apenas o PDV. Outras páginas exigem login administrativo.</p>
            </div>
            <button
              onClick={handlePDVAccess}
              className="w-full md:w-auto bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold px-5 py-3 rounded-lg transition active:scale-95"
            >
              Entrar como Usuário (Somente PDV)
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">Selecione o modo de acesso desejado</p>
        </div>
      </div>

      {/* Modal de Login Admin */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Acesso Administrativo</h2>
              <p className="text-slate-400">Digite suas credenciais</p>
            </div>

            {loginError && (
              <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg mb-6">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                  placeholder="admin@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Senha</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-orange-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? 'Entrando...' : 'Entrar como Admin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
