'use client';

import { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useBoxes } from '@/context/BoxesContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditBox() {
  const params = useParams();
  const router = useRouter();
  const { getBoxById, updateBox } = useBoxes();

  const id = params.id as string;
  const box = getBoxById(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | undefined>('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (box) {
      setName(box.name);
      setPrice(box.price.toString());
      setImage(box.image || '');
    } else {
      setError('Box não encontrado');
    }
  }, [box]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && price) {
      updateBox(id, {
        name,
        price: parseFloat(price),
        image: image || undefined,
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push('/boxes');
      }, 1500);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link
          href="/boxes"
          className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
        >
          ← Voltar para Boxes
        </Link>
      </div>
    );
  }

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

      <h1 className="text-3xl font-bold mb-6">Editar Box</h1>

      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Box atualizado com sucesso! Redirecionando...
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
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
