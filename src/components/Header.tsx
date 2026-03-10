'use client';

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-orange-600 text-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <span className="text-orange-500">⚙️</span>
            <span>Auto Car Sul</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-orange-400 transition duration-300 font-semibold">Dashboard</Link>
            <Link href="/products" className="hover:text-orange-400 transition duration-300 font-semibold">Produtos</Link>
            <Link href="/services" className="hover:text-orange-400 transition duration-300 font-semibold">Serviços</Link>
            <Link href="/boxes" className="hover:text-orange-400 transition duration-300 font-semibold">Boxes</Link>
            <Link href="/partnerships" className="hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-1">
              <span>🤝</span>Parcerias
            </Link>
            <Link href="/users" className="hover:text-orange-400 transition duration-300 font-semibold flex items-center gap-1">
              <span>👥</span>Usuários
            </Link>
            <Link href="/cart" className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 px-4 py-2 rounded-lg font-bold transition duration-300 flex items-center gap-2">
              <span>🛒</span>
              <span>PDV</span>
            </Link>
            <div className="flex items-center gap-4 ml-4 border-l border-slate-600 pl-4">
              <span className="text-slate-300 text-sm">Olá, {user.name}</span>
              <button
                onClick={logout}
                className="text-orange-400 hover:text-orange-300 font-semibold transition duration-300"
              >
                Sair
              </button>
            </div>
          </nav>

          {/* Mobile: greeting + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <span className="text-slate-300 text-sm truncate max-w-[100px]">Olá, {user.name}</span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2 rounded-lg hover:bg-slate-700 transition text-xl leading-none"
              aria-label="Abrir menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden mt-3 pt-3 pb-2 border-t border-slate-700 flex flex-col gap-1">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition py-2.5 px-2 rounded-lg hover:bg-slate-700 font-semibold">🏠 Dashboard</Link>
            <Link href="/products" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition py-2.5 px-2 rounded-lg hover:bg-slate-700 font-semibold">🛠️ Produtos</Link>
            <Link href="/services" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition py-2.5 px-2 rounded-lg hover:bg-slate-700 font-semibold">⚙️ Serviços</Link>
            <Link href="/boxes" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition py-2.5 px-2 rounded-lg hover:bg-slate-700 font-semibold">📦 Boxes</Link>
            <Link href="/partnerships" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition py-2.5 px-2 rounded-lg hover:bg-slate-700 font-semibold">🤝 Parcerias</Link>
            <Link href="/users" onClick={() => setMenuOpen(false)} className="hover:text-orange-400 transition py-2.5 px-2 rounded-lg hover:bg-slate-700 font-semibold">👥 Usuários</Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="mt-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 px-4 py-2.5 rounded-lg font-bold transition text-center">🛒 PDV</Link>
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="mt-1 text-left text-orange-400 hover:text-orange-300 font-semibold transition py-2.5 px-2 rounded-lg hover:bg-slate-700"
            >
              Sair
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}