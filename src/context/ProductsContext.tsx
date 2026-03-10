'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  partnership?: number;
  description?: string;
  image?: string; // Base64 encoded image or URL
};

type ProductsContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', name: 'Óleo de Motor', price: 50, cost: 25, partnership: 35, description: 'Óleo premium para motores' },
  { id: '2', name: 'Filtro de Ar', price: 20, cost: 8, partnership: 15, description: 'Filtro de ar de alta qualidade' },
  { id: '3', name: 'Kit de Corrente', price: 150, cost: 70, partnership: 110, description: 'Kit completo de corrente' },
];

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProducts(initialProducts);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que mudam
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Omit<Product, 'id'>) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, ...product } : p)
    );
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, removeProduct, getProductById }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}
