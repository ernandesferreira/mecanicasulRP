'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Service = {
  id: string;
  name: string;
  price: number;
  image?: string; // Base64 encoded image or URL
  hasDisplacement?: boolean; // Tem custo de deslocamento por KM?
};

type ServicesContextType = {
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Omit<Service, 'id'>) => void;
  removeService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

const initialServices: Service[] = [
  { id: '1', name: 'Troca de Óleo', price: 100 },
  { id: '2', name: 'Revisão Completa', price: 300 },
];

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        setServices(JSON.parse(savedServices));
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        setServices(initialServices);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('services', JSON.stringify(services));
    }
  }, [services, isLoaded]);

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, service: Omit<Service, 'id'>) => {
    setServices(prev => 
      prev.map(s => s.id === id ? { ...s, ...service } : s)
    );
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  return (
    <ServicesContext.Provider value={{ services, addService, updateService, removeService, getServiceById }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) throw new Error('useServices must be used within ServicesProvider');
  return context;
}
