'use client';

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) setUsers(await res.json())
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      const body: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }
      if (formData.password) body.password = formData.password

      await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })
    }

    await loadUsers()
    setShowModal(false)
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'user' })
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setShowModal(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      await loadUsers()
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', password: '', role: 'user' })
    setShowModal(true)
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-slate-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">
      <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500 flex items-center gap-2">
            <span>👥</span>
            Gerenciar Usuários
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 px-6 py-3 rounded-lg font-bold transition duration-300 flex items-center gap-2"
          >
            <span>➕</span>
            Novo Usuário
          </button>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300 font-semibold">Nome</th>
                <th className="px-6 py-4 text-left text-slate-300 font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-slate-300 font-semibold">Função</th>
                <th className="px-6 py-4 text-center text-slate-300 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-800/50">
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-slate-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === 'admin'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm font-semibold transition duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm font-semibold transition duration-300"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Nenhum usuário cadastrado ainda.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 w-full max-w-md">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-slate-300 mb-2">Senha</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-slate-300 mb-2">Função</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 px-4 py-2 rounded font-bold transition duration-300"
                >
                  {editingUser ? 'Salvar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded font-semibold transition duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}