'use client';

import { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useBoxes } from '@/context/BoxesContext';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function RegisterBox() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | undefined>('');
  const [submitted, setSubmitted] = useState(false);
  const { addBox } = useBoxes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && price) {
      addBox({
        name,
        price: parseFloat(price),
        image: image || undefined,
      });

      setName('');
      setPrice('');
      setImage('');
      setSubmitted(true);

      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/boxes"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Voltar para Boxes
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Cadastrar Novo Box</h1>

      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Box cadastrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Nome do Box *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Box Básico"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Preço do Box (R$) *
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

        <ImageUpload
          value={image}
          onChange={setImage}
          label="Imagem do Box"
          className="mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Cadastrar Box
        </button>
      </form>
    </div>
  );
}
