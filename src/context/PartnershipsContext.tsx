'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type PartnershipItem = {
  id: string;
  name: string;
  type: 'product' | 'service' | 'box';
  partnerPrice: number;
};

type Partnership = {
  id: string;
  name: string;
  items: PartnershipItem[];
};

type PartnershipsContextType = {
  partnerships: Partnership[];
  addPartnership: (partnership: Omit<Partnership, 'id'>) => void;
  updatePartnership: (id: string, partnership: Omit<Partnership, 'id'>) => void;
  removePartnership: (id: string) => void;
  getPartnershipById: (id: string) => Partnership | undefined;
};

const PartnershipsContext = createContext<PartnershipsContextType | undefined>(undefined);

export function PartnershipsProvider({ children }: { children: React.ReactNode }) {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('partnerships');
    if (saved) {
      setPartnerships(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('partnerships', JSON.stringify(partnerships));
    }
  }, [partnerships, isLoaded]);

  const addPartnership = (partnership: Omit<Partnership, 'id'>) => {
    const newPartnership: Partnership = {
      ...partnership,
      id: Date.now().toString(),
    };
    setPartnerships(prev => [...prev, newPartnership]);
  };

  const updatePartnership = (id: string, partnership: Omit<Partnership, 'id'>) => {
    setPartnerships(prev =>
      prev.map(p => (p.id === id ? { ...p, ...partnership } : p))
    );
  };

  const removePartnership = (id: string) => {
    setPartnerships(prev => prev.filter(p => p.id !== id));
  };

  const getPartnershipById = (id: string): Partnership | undefined => {
    return partnerships.find(p => p.id === id);
  };

  return (
    <PartnershipsContext.Provider value={{ partnerships, addPartnership, updatePartnership, removePartnership, getPartnershipById }}>
      {children}
    </PartnershipsContext.Provider>
  );
}

export function usePartnerships() {
  const context = useContext(PartnershipsContext);
  if (!context) throw new Error('usePartnerships must be used within PartnershipsProvider');
  return context;
}
