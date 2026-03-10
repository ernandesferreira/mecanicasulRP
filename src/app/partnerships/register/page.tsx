'use client';

import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { usePartnerships } from '@/context/PartnershipsContext';
import { useProducts } from '@/context/ProductsContext';
import { useServices } from '@/context/ServicesContext';
import { useBoxes } from '@/context/BoxesContext';
import Link from 'next/link';

type ItemToAdd = {
  id: string;
  sourceItemId?: string;
  name: string;
  type: 'product' | 'service' | 'box';
  partnerPrice: string;
};

export default function RegisterPartnership() {
  const [name, setName] = useState('');
  const [selectedItems, setSelectedItems] = useState<ItemToAdd[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const { addPartnership } = usePartnerships();
  const { products } = useProducts();
  const { services } = useServices();
  const { boxes } = useBoxes();

  const handleAddItem = (id: string, itemName: string, type: 'product' | 'service' | 'box') => {
    if (!selectedItems.find(item => item.id === id && item.type === type)) {
      setSelectedItems([...selectedItems, { id, name: itemName, type, partnerPrice: '' }]);
    }
  };

  const handleRemoveItem = (id: string, type: 'product' | 'service' | 'box') => {
    setSelectedItems(selectedItems.filter(item => !(item.id === id && item.type === type)));
  };

  const handleUpdatePrice = (id: string, type: 'product' | 'service' | 'box', price: string) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === id && item.type === type ? { ...item, partnerPrice: price } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && selectedItems.length > 0 && selectedItems.every(item => item.partnerPrice)) {
      addPartnership({
        name,
        items: selectedItems.map(item => ({
          ...item,
          sourceItemId: item.sourceItemId ?? item.id,
          partnerPrice: parseFloat(item.partnerPrice),
        })),
      });
      
      setName('');
      setSelectedItems([]);
      setSubmitted(true);
      
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const allItems = [
    ...products.map(p => ({ id: p.id, name: p.name, type: 'product' as const })),
    ...services.map(s => ({ id: s.id, name: s.name, type: 'service' as const })),
    ...boxes.map(b => ({ id: b.id, name: b.name, type: 'box' as const })),
  ];

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link 
          href="/partnerships"
          className="text-orange-400 hover:text-orange-300 underline flex items-center gap-2"
        >
          ← Voltar para Parcerias
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">+ Nova Parceria</h1>
      
      {submitted && (
        <div className="bg-green-900/30 border border-green-600 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <span>✅</span> Parceria cadastrada com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nome da Parceria */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Informações da Parceria</h2>
          
          <div>
            <label className="block text-white font-bold mb-3">
              Nome da Parceria *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Parceria ABC Ltda"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition"
              required
            />
          </div>
        </div>

        {/* Seleção de Itens */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🛍️ Produtos/Serviços/Boxes</h2>
          
          {/* Produtos */}
          {products.length > 0 && (
            <div className="mb-6">
              <p className="text-orange-400 font-bold text-sm uppercase mb-3">🛠️ Produtos</p>
              <div className="grid grid-cols-2 gap-2">
                {products.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleAddItem(product.id, product.name, 'product')}
                    disabled={selectedItems.some(item => item.id === product.id && item.type === 'product')}
                    className="p-3 bg-slate-700 border border-slate-600 rounded-lg hover:border-orange-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-left text-white"
                  >
                    <p className="font-bold text-sm">{product.name}</p>
                    <p className="text-xs text-slate-400">R$ {product.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Serviços */}
          {services.length > 0 && (
            <div className="mb-6">
              <p className="text-orange-400 font-bold text-sm uppercase mb-3">⚙️ Serviços</p>
              <div className="grid grid-cols-2 gap-2">
                {services.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleAddItem(service.id, service.name, 'service')}
                    disabled={selectedItems.some(item => item.id === service.id && item.type === 'service')}
                    className="p-3 bg-slate-700 border border-slate-600 rounded-lg hover:border-orange-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-left text-white"
                  >
                    <p className="font-bold text-sm">{service.name}</p>
                    <p className="text-xs text-slate-400">R$ {service.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Boxes */}
          {boxes.length > 0 && (
            <div>
              <p className="text-orange-400 font-bold text-sm uppercase mb-3">📦 Boxes/Pacotes</p>
              <div className="grid grid-cols-2 gap-2">
                {boxes.map(box => (
                  <button
                    key={box.id}
                    type="button"
                    onClick={() => handleAddItem(box.id, box.name, 'box')}
                    disabled={selectedItems.some(item => item.id === box.id && item.type === 'box')}
                    className="p-3 bg-slate-700 border border-slate-600 rounded-lg hover:border-orange-500 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-left text-white"
                  >
                    <p className="font-bold text-sm">{box.name}</p>
                    <p className="text-xs text-slate-400">R$ {box.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itens Selecionados */}
        {selectedItems.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">✅ Itens Selecionados</h2>
            
            <div className="space-y-4">
              {selectedItems.map(item => (
                <div key={`${item.id}-${item.type}`} className="bg-slate-700 border border-slate-600 rounded-lg p-4 flex items-end justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">
                      {item.type === 'product' && '🛠️'} 
                      {item.type === 'service' && '⚙️'} 
                      {item.type === 'box' && '📦'} 
                      {' '}{item.name}
                    </p>
                    <p className="text-slate-400 text-xs uppercase">Valor para o Parceiro</p>
                  </div>
                  
                  <div className="flex items-end gap-3">
                    <CurrencyInput
                      name={`price-${item.id}-${item.type}`}
                      value={item.partnerPrice}
                      onValueChange={(value) => handleUpdatePrice(item.id, item.type, value?.toString() || '')}
                      prefix="R$ "
                      intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                      decimalsLimit={2}
                      placeholder="R$ 0,00"
                      className="w-32 bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id, item.type)}
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 font-bold px-3 py-2 rounded-lg transition border border-red-900/50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={!name || selectedItems.length === 0 || selectedItems.some(item => !item.partnerPrice)}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-orange-500/30 active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✅ Cadastrar Parceria
        </button>
      </form>
    </div>
  );
}
