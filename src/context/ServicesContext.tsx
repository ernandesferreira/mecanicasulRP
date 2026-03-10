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
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Omit<Service, 'id'>) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) setServices(await res.json());
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const addService = async (service: Omit<Service, 'id'>) => {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    await fetchServices();
  };

  const updateService = async (id: string, service: Omit<Service, 'id'>) => {
    await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    await fetchServices();
  };

  const removeService = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    await fetchServices();
  };

  const getServiceById = (id: string) => services.find(s => s.id === id);

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
