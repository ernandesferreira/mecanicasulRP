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
  addBox: (box: Omit<Box, 'id'>) => void;
  updateBox: (id: string, box: Omit<Box, 'id'>) => void;
  removeBox: (id: string) => void;
  getBoxById: (id: string) => Box | undefined;
};

const BoxesContext = createContext<BoxesContextType | undefined>(undefined);

const initialBoxes: Box[] = [
  { id: '1', name: 'Box Básico', price: 200 },
  { id: '2', name: 'Box Premium', price: 500 },
];

export function BoxesProvider({ children }: { children: React.ReactNode }) {
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedBoxes = localStorage.getItem('boxes');
    if (savedBoxes) {
      try {
        setBoxes(JSON.parse(savedBoxes));
      } catch (error) {
        console.error('Erro ao carregar boxes:', error);
        setBoxes(initialBoxes);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('boxes', JSON.stringify(boxes));
    }
  }, [boxes, isLoaded]);

  const addBox = (box: Omit<Box, 'id'>) => {
    const newBox: Box = {
      ...box,
      id: Date.now().toString(),
    };
    setBoxes(prev => [...prev, newBox]);
  };

  const updateBox = (id: string, box: Omit<Box, 'id'>) => {
    setBoxes(prev => 
      prev.map(b => b.id === id ? { ...b, ...box } : b)
    );
  };

  const removeBox = (id: string) => {
    setBoxes(prev => prev.filter(box => box.id !== id));
  };

  const getBoxById = (id: string) => {
    return boxes.find(box => box.id === id);
  };

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
