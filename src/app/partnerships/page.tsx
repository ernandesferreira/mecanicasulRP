'use client';

import { useState } from 'react';
import { usePartnerships } from '@/context/PartnershipsContext';
import Link from 'next/link';

export default function Partnerships() {
  const { partnerships, removePartnership } = usePartnerships();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    removePartnership(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">🤝 Parcerias</h1>
        <Link
          href="/partnerships/register"
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-orange-500/30 active:scale-95"
        >
          + Nova Parceria
        </Link>
      </div>

      {partnerships.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-xl mb-6">📭 Nenhuma parceria cadastrada</p>
          <Link
            href="/partnerships/register"
            className="inline-block bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg shadow-orange-500/30"
          >
            Cadastrar a Primeira Parceria
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {partnerships.map(partnership => (
            <div
              key={partnership.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
            >
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">🏢 {partnership.name}</h3>
                  
                  <div className="bg-slate-700 rounded-lg p-4 mb-4">
                    <p className="text-slate-400 text-xs uppercase mb-3 font-bold">Produtos/Serviços ({partnership.items.length})</p>
                    {partnership.items.length === 0 ? (
                      <p className="text-slate-500 text-sm">Nenhum item vinculado</p>
                    ) : (
                      <div className="space-y-2">
                        {partnership.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-white">
                              {item.type === 'product' && '🛠️'} 
                              {item.type === 'service' && '⚙️'} 
                              {item.type === 'box' && '📦'} 
                              {' '}{item.name}
                            </span>
                            <span className="text-orange-400 font-bold">R$ {item.partnerPrice.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/partnerships/${partnership.id}/edit`}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap text-center border border-slate-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(partnership.id)}
                    className="bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold py-2 px-4 rounded-lg transition whitespace-nowrap border border-red-900/50"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              {deleteConfirm === partnership.id && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-slate-800 border border-orange-600 rounded-xl p-8 max-w-sm">
                    <h3 className="text-xl font-bold mb-4 text-orange-400">⚠️ Confirmar Exclusão</h3>
                    <p className="text-slate-300 mb-6">
                      Tem certeza que deseja deletar a parceria "<strong>{partnership.name}</strong>"?
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition border border-slate-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(partnership.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
