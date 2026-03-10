'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useBoxes } from '@/context/BoxesContext';
import Link from 'next/link';
import { formatBRLWithoutCurrency } from '@/utils/formatCurrency';

export default function Boxes() {
  const { boxes, removeBox } = useBoxes();
  const { addToCart } = useCart();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    removeBox(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">📦 Boxes/Pacotes</h1>
        <Link
          href="/boxes/register"
          className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-orange-500/30 active:scale-95"
        >
          + Novo Box
        </Link>
      </div>

      {boxes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-xl mb-6">📭 Nenhum box cadastrado</p>
          <Link
            href="/boxes/register"
            className="inline-block bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg shadow-orange-500/30"
          >
            Cadastrar o Primeiro Box
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {boxes.map(box => (
            <div
              key={box.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                    {box.image ? (
                      <img
                        src={box.image}
                        alt={box.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
                        SEM IMAGEM
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{box.name}</h3>
                    <div className="bg-slate-700 p-4 rounded-lg inline-block">
                      <p className="text-slate-400 text-xs uppercase mb-1">Valor do Box</p>
                      <p className="text-2xl font-bold text-orange-400">R$ {formatBRLWithoutCurrency(box.price)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 flex-wrap">
                  <button
                    onClick={() => addToCart({ ...box, type: 'box' })}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap active:scale-95"
                  >
                    Adicionar
                  </button>
                  <Link
                    href={`/boxes/${box.id}/edit`}
                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap text-center border border-slate-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(box.id)}
                    className="bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold py-2 px-4 rounded-lg transition whitespace-nowrap border border-red-900/50"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              {deleteConfirm === box.id && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-slate-800 border border-orange-600 rounded-xl p-8 max-w-sm">
                    <h3 className="text-xl font-bold mb-4 text-orange-400">⚠️ Confirmar Exclusão</h3>
                    <p className="text-slate-300 mb-6">
                      Tem certeza que deseja deletar o box "<strong>{box.name}</strong>"?
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition border border-slate-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(box.id)}
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