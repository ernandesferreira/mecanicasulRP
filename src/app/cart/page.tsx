'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductsContext';
import { useServices } from '@/context/ServicesContext';
import { useBoxes } from '@/context/BoxesContext';
import { usePartnerships } from '@/context/PartnershipsContext';
import { formatBRLWithoutCurrency } from '@/utils/formatCurrency';

export default function Cart() {
  const { cart, addToCart, removeFromCart, updateQuantity, updateKm, setSelectedPartnership, selectedPartnershipId, clearCart, total } = useCart();
  const { products } = useProducts();
  const { services } = useServices();
  const { boxes } = useBoxes();
  const { partnerships } = usePartnerships();
  const [showToast, setShowToast] = useState(false);

  type KmModal = { id: string; name: string; basePrice: number } | null;
  const [kmModal, setKmModal] = useState<KmModal>(null);
  const [kmInput, setKmInput] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart'>('catalog');

  const handleServiceClick = (service: { id: string; name: string; price: number; hasDisplacement?: boolean }) => {
    if (service.hasDisplacement) {
      const inCart = cart.find(i => i.id === service.id);
      setKmInput(inCart?.km?.toString() ?? '');
      setKmModal({ id: service.id, name: service.name, basePrice: service.price });
    } else {
      addToCart({ id: service.id, name: service.name, price: service.price, type: 'service' });
    }
  };

  const handleConfirmKm = () => {
    if (!kmModal) return;
    const km = parseFloat(kmInput) || 0;
    const inCart = cart.find(i => i.id === kmModal.id);
    if (inCart) {
      updateKm(kmModal.id, km);
    } else {
      addToCart({
        id: kmModal.id,
        name: kmModal.name,
        price: kmModal.basePrice + (km * 1000),
        basePrice: kmModal.basePrice,
        km,
        type: 'service',
      });
    }
    setKmModal(null);
    setKmInput('');
  };

  const handleCopyValue = () => {
    const totalValue = getTotalWithPartnership();
    navigator.clipboard.writeText(totalValue.toString()).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    });
  };

  const getItemPrice = (itemId: string) => {
    if (!selectedPartnershipId) return null;
    const partnership = partnerships.find(p => p.id === selectedPartnershipId);
    if (!partnership) return null;
    const partnerItem = partnership.items.find(i => i.id === itemId);
    return partnerItem ? partnerItem.partnerPrice : null;
  };

  const getTotalWithPartnership = () => {
    if (!selectedPartnershipId) return total;
    
    return cart.reduce((sum, item) => {
      const partnerPrice = getItemPrice(item.id);
      const itemPrice = partnerPrice !== null ? partnerPrice : item.price;
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Tab Bar */}
      <div className="md:hidden sticky top-0 z-20 flex bg-slate-800 border-b border-orange-600">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-3 text-sm font-bold transition border-b-2 ${activeTab === 'catalog' ? 'text-orange-400 border-orange-500' : 'text-slate-400 border-transparent'}`}
        >
          🛒 Catálogo
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-3 text-sm font-bold transition border-b-2 ${activeTab === 'cart' ? 'text-orange-400 border-orange-500' : 'text-slate-400 border-transparent'}`}
        >
          🛍️ Carrinho{cart.length > 0 && (
            <span className="ml-1.5 bg-orange-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full align-middle">{cart.length}</span>
          )}
        </button>
      </div>

      <div className="md:grid md:grid-cols-3 md:h-screen">
        {/* Área de Itens Disponíveis */}
        <div className={`md:col-span-2 flex flex-col bg-slate-900 md:overflow-hidden ${activeTab === 'catalog' ? '' : 'hidden md:flex'}`}>
          <div className="p-4 md:p-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
            <div className="flex items-center gap-4 mb-2">
              <Link
                href="/"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors active:scale-95"
              >
                <span className="text-xl">⬅️</span>
                <span className="font-semibold">Voltar</span>
              </Link>
            </div>
            <h2 className="text-xl md:text-3xl font-bold">Catálogo</h2>
            <p className="text-orange-100 text-sm mt-2">Toque para adicionar ao carrinho</p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* PRODUTOS */}
            {products.length > 0 && (
              <div className="border-b border-slate-700">
                <div className="sticky top-0 bg-slate-800 px-5 py-3 font-bold text-orange-400 border-b border-slate-700">
                  <span className="text-xl">🛠️ PRODUTOS</span> <span className="text-slate-500">({products.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                  {products.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, type: 'product' })}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-semibold">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm line-clamp-2 text-white">{product.name}</p>
                          <p className="text-orange-400 font-bold text-lg mt-1">R$ {formatBRLWithoutCurrency(product.price)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SERVIÇOS */}
            {services.length > 0 && (
              <div className="border-b border-slate-700">
                <div className="sticky top-0 bg-slate-800 px-5 py-3 font-bold text-orange-400 border-b border-slate-700">
                  <span className="text-xl">⚙️ SERVIÇOS</span> <span className="text-slate-500">({services.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                  {services.map(service => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-semibold">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm line-clamp-2 text-white">{service.name}</p>
                          <p className="text-orange-400 font-bold text-lg mt-1">R$ {formatBRLWithoutCurrency(service.price)}</p>
                          {service.hasDisplacement && (
                            <p className="text-orange-300 text-[10px] font-semibold mt-0.5">🚗 + KM</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CAIXAS */}
            {boxes.length > 0 && (
              <div>
                <div className="sticky top-0 bg-slate-800 px-5 py-3 font-bold text-orange-400 border-b border-slate-700">
                  <span className="text-xl">📦 CAIXAS/PACOTES</span> <span className="text-slate-500">({boxes.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                  {boxes.map(box => (
                    <button
                      key={box.id}
                      onClick={() => addToCart({ id: box.id, name: box.name, price: box.price, type: 'box' })}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                          {box.image ? (
                            <img
                              src={box.image}
                              alt={box.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-semibold">
                              IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm line-clamp-2 text-white">{box.name}</p>
                          <p className="text-orange-400 font-bold text-lg mt-1">R$ {formatBRLWithoutCurrency(box.price)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {products.length === 0 && services.length === 0 && boxes.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-slate-500 text-lg">📭 Nenhum item</p>
                  <p className="text-slate-600 text-sm mt-2">cadastrado</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DE CARRINHO E RESUMO - Mobile Style */}
        <div className={`flex flex-col bg-slate-800 border-l border-slate-700 md:h-screen ${activeTab === 'cart' ? '' : 'hidden md:flex'}`}>
          {/* Título do Carrinho */}
          <div className="p-5 bg-gradient-to-b from-slate-700 to-slate-800 border-b border-orange-600">
            <h2 className="text-2xl font-bold text-white">🛒</h2>
            <p className="text-orange-400 text-sm font-bold mt-2">Carrinho</p>
            <p className="text-slate-400 text-xs">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Lista de Itens do Carrinho */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-slate-500 text-lg">🛍️</p>
                <p className="text-slate-400 text-sm mt-3">Carrinho vazio</p>
                <p className="text-slate-600 text-xs mt-1">Escolha um item</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="p-3 bg-slate-700 rounded-xl border border-slate-600 hover:border-orange-500 transition-colors">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="font-bold line-clamp-2 flex-1 text-white text-xs">{item.name}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-orange-400 hover:text-orange-500 font-bold text-lg flex-shrink-0 active:scale-90 transition"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold w-8 active:scale-90 transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="flex-1 text-center bg-slate-600 text-white border border-slate-500 rounded-lg text-xs py-1 font-bold"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold w-8 active:scale-90 transition"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-slate-300 text-xs">
                        <span>{getItemPrice(item.id) !== null ? '🤝 R$' : 'R$'} {getItemPrice(item.id) !== null ? formatBRLWithoutCurrency(getItemPrice(item.id)!) : formatBRLWithoutCurrency(item.price)}</span>
                        <span className="font-bold text-orange-400">R$ {formatBRLWithoutCurrency((getItemPrice(item.id) !== null ? getItemPrice(item.id)! : item.price) * item.quantity)}</span>
                      </div>
                      {item.type === 'box' && (
                        <div className="text-slate-400 text-xs">
                          <p>Quantidade: {item.quantity}</p>
                          <p>Valor a Depositar: R$ {formatBRLWithoutCurrency(((getItemPrice(item.id) !== null ? getItemPrice(item.id)! : item.price) - 10000) * item.quantity)} - Pix 160</p>
                        </div>
                      )}
                      {item.type === 'service' && item.km !== undefined && (
                        <div className="mt-1 bg-slate-600/50 rounded-lg p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">🚗 {item.km} KM × R$ 1.000,00</span>
                            <button
                              onClick={() => {
                                setKmInput((item.km ?? 0).toString());
                                setKmModal({ id: item.id, name: item.name, basePrice: item.basePrice ?? item.price });
                              }}
                              className="text-orange-400 hover:text-orange-300 font-semibold transition ml-2"
                            >
                              ✏️
                            </button>
                          </div>
                          <div className="text-slate-400 mt-0.5">
                            Reparo: R$ {formatBRLWithoutCurrency(item.basePrice ?? 0)} + Desl.: R$ {formatBRLWithoutCurrency((item.km ?? 0) * 1000)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Seleção de Parceria */}
          {partnerships.length > 0 && (
            <div className="p-4 bg-slate-700 border-t border-slate-600">
              <label className="block text-slate-300 text-xs uppercase tracking-wider font-bold mb-2">🤝 Parceria</label>
              <select
                value={selectedPartnershipId || ''}
                onChange={(e) => setSelectedPartnership(e.target.value || null)}
                className="w-full text-sm bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 transition"
              >
                <option value="">Nenhuma parceria</option>
                {partnerships.map(partnership => (
                  <option key={partnership.id} value={partnership.id}>
                    {partnership.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Resumo */}
          <div className="p-4 bg-slate-700 border-t border-slate-600">
            <div className="mb-1 text-slate-400 text-xs uppercase tracking-wider">Total a pagar</div>
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-sm">Subtotal:</span>
              <span className="text-orange-400 font-bold text-xl">R$ {formatBRLWithoutCurrency(getTotalWithPartnership())}</span>
            </div>
          </div>

          {/* Botões */}
          <div className="p-4 flex flex-col gap-3 bg-slate-800 border-t border-slate-700">
            <button
              onClick={handleCopyValue}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all active:scale-95 text-base shadow-lg shadow-orange-500/30"
            >
              💰 COPIAR VALOR {selectedPartnershipId && '(com desconto)'}
            </button>
            <button
              onClick={() => clearCart()}
              disabled={cart.length === 0}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95 text-sm border border-slate-600"
            >
              🗑️ LIMPAR
            </button>
          </div>
        </div>
      </div>

      {/* Modal de KM para Serviços */}
      {kmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-orange-600 rounded-xl p-8 w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold mb-1 text-orange-400">🚗 Reparo Externo</h3>
            <p className="text-slate-300 text-sm mb-6">{kmModal.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wide mb-2">
                  Quantidade de KM
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={kmInput}
                  onChange={(e) => setKmInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmKm()}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-slate-700 border border-slate-500 rounded-lg px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div className="bg-slate-700 rounded-lg p-4 space-y-1 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Reparo:</span>
                  <span>R$ {formatBRLWithoutCurrency(kmModal.basePrice)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Deslocamento ({parseFloat(kmInput) || 0} KM × R$ 1.000):</span>
                  <span>+ R$ {formatBRLWithoutCurrency((parseFloat(kmInput) || 0) * 1000)}</span>
                </div>
                <div className="flex justify-between font-bold text-orange-400 text-base border-t border-slate-600 pt-2 mt-1">
                  <span>Total:</span>
                  <span>R$ {formatBRLWithoutCurrency(kmModal.basePrice + (parseFloat(kmInput) || 0) * 1000)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setKmModal(null); setKmInput(''); }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition border border-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmKm}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {cart.find(i => i.id === kmModal.id) ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl shadow-2xl shadow-orange-500/40 flex items-center gap-3 font-semibold text-sm">
              <span className="text-xl">✅</span>
              <span>Valor copiado para área de transferência!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

