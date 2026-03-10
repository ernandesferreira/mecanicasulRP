'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Box = {
  id: string;
  name: string;
  price: number;
  image?: string; // Base64 encoded image or URL
};

type BoxesContextType = {
  boxes: Box[];
  addBox: (box: Omit<Box, 'id'>) => Promise<void>;
  updateBox: (id: string, box: Omit<Box, 'id'>) => Promise<void>;
  removeBox: (id: string) => Promise<void>;
  getBoxById: (id: string) => Box | undefined;
};

const BoxesContext = createContext<BoxesContextType | undefined>(undefined);

export function BoxesProvider({ children }: { children: React.ReactNode }) {
  const [boxes, setBoxes] = useState<Box[]>([]);

  const fetchBoxes = async () => {
    try {
      const res = await fetch('/api/boxes');
      if (res.ok) setBoxes(await res.json());
    } catch (error) {
      console.error('Erro ao carregar boxes:', error);
    }
  };

  useEffect(() => { fetchBoxes(); }, []);

  const addBox = async (box: Omit<Box, 'id'>) => {
    await fetch('/api/boxes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(box),
    });
    await fetchBoxes();
  };

  const updateBox = async (id: string, box: Omit<Box, 'id'>) => {
    await fetch(`/api/boxes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(box),
    });
    await fetchBoxes();
  };

  const removeBox = async (id: string) => {
    await fetch(`/api/boxes/${id}`, { method: 'DELETE' });
    await fetchBoxes();
  };

  const getBoxById = (id: string) => boxes.find(b => b.id === id);

  return (
    <BoxesContext.Provider value={{ boxes, addBox, updateBox, removeBox, getBoxById }}>
      {children}
    </BoxesContext.Provider>
  );
}

export function useBoxes() {
  const context = useContext(BoxesContext);
  if (!context) throw new Error('useBoxes must be used within BoxesProvider');
  return context;
}
