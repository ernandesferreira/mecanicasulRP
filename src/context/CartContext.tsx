'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Item = {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  km?: number;
  type: 'product' | 'service' | 'box';
  quantity: number;
};

type CartContextType = {
  cart: Item[];
  addToCart: (item: Omit<Item, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateKm: (id: string, km: number) => void;
  setSelectedPartnership: (partnershipId: string | null) => void;
  selectedPartnershipId: string | null;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Item[]>([]);
  const [selectedPartnershipId, setSelectedPartnership] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedPartnership = localStorage.getItem('selectedPartnership');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        setCart([]);
      }
    }
    if (savedPartnership) {
      setSelectedPartnership(savedPartnership);
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (selectedPartnershipId) {
        localStorage.setItem('selectedPartnership', selectedPartnershipId);
      } else {
        localStorage.removeItem('selectedPartnership');
      }
    }
  }, [selectedPartnershipId, isLoaded]);

  const addToCart = (item: Omit<Item, 'quantity'>) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateKm = (id: string, km: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const base = item.basePrice ?? item.price;
        return { ...item, km, price: base + (km * 1000), basePrice: base };
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateKm, setSelectedPartnership, selectedPartnershipId, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}