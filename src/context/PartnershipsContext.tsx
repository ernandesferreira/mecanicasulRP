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
  addPartnership: (partnership: Omit<Partnership, 'id'>) => Promise<void>;
  updatePartnership: (id: string, partnership: Omit<Partnership, 'id'>) => Promise<void>;
  removePartnership: (id: string) => Promise<void>;
  getPartnershipById: (id: string) => Partnership | undefined;
};

const PartnershipsContext = createContext<PartnershipsContextType | undefined>(undefined);

export function PartnershipsProvider({ children }: { children: React.ReactNode }) {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);

  const fetchPartnerships = async () => {
    try {
      const res = await fetch('/api/partnerships');
      if (res.ok) setPartnerships(await res.json());
    } catch (error) {
      console.error('Erro ao carregar parcerias:', error);
    }
  };

  useEffect(() => { fetchPartnerships(); }, []);

  const addPartnership = async (partnership: Omit<Partnership, 'id'>) => {
    await fetch('/api/partnerships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partnership),
    });
    await fetchPartnerships();
  };

  const updatePartnership = async (id: string, partnership: Omit<Partnership, 'id'>) => {
    await fetch(`/api/partnerships/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partnership),
    });
    await fetchPartnerships();
  };

  const removePartnership = async (id: string) => {
    await fetch(`/api/partnerships/${id}`, { method: 'DELETE' });
    await fetchPartnerships();
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
