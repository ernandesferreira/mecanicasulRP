'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  partnership?: number;
  description?: string;
  image?: string;
};

type ProductsContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    await fetchProducts();
  };

  const updateProduct = async (id: string, product: Omit<Product, 'id'>) => {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    await fetchProducts();
  };

  const removeProduct = async (id: string) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    await fetchProducts();
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

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
