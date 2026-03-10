'use client';

import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useProducts } from '@/context/ProductsContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function RegisterProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [partnership, setPartnership] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>('');
  const [submitted, setSubmitted] = useState(false);
  const { addProduct } = useProducts();

  const profit = price && cost ? (parseFloat(price) - parseFloat(cost)).toFixed(2) : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && price && cost) {
      addProduct({
        name,
        price: parseFloat(price),
        cost: parseFloat(cost),
        partnership: partnership ? parseFloat(partnership) : undefined,
        description,
        image: image || undefined,
      });
      
      setName('');
      setPrice('');
      setCost('');
      setPartnership('');
      setDescription('');
      setImage('');
      setSubmitted(true);
      
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link 
          href="/products"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Voltar para Produtos
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Cadastrar Novo Produto</h1>
      
      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Produto cadastrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Nome do Produto *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Óleo de Motor"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Preço de Venda (R$) *
          </label>
          <CurrencyInput
            name="price"
            value={price}
            onValueChange={(value) => setPrice(value?.toString() || '')}
            prefix="R$ "
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            decimalsLimit={2}
            placeholder="R$ 0,00"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Custo do Produto (R$) *
          </label>
          <CurrencyInput
            name="cost"
            value={cost}
            onValueChange={(value) => setCost(value?.toString() || '')}
            prefix="R$ "
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            decimalsLimit={2}
            placeholder="R$ 0,00"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Valor de Parceria (R$)
          </label>
          <CurrencyInput
            name="partnership"
            value={partnership}
            onValueChange={(value) => setPartnership(value?.toString() || '')}
            prefix="R$ "
            intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
            decimalsLimit={2}
            placeholder="R$ 0,00"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Preço especial para parceiros (opcional)</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do produto (opcional)"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
          />
        </div>

        <ImageUpload
          value={image}
          onChange={setImage}
          label="Imagem do Produto"
          className="mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
}
