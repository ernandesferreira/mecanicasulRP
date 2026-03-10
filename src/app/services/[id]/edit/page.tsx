'use client';

import { useState, useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useServices } from '@/context/ServicesContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  const { getServiceById, updateService } = useServices();

  const id = params.id as string;
  const service = getServiceById(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | undefined>('');
  const [submitted, setSubmitted] = useState(false);
  const [hasDisplacement, setHasDisplacement] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(service.price.toString());
      setImage(service.image || '');
      setHasDisplacement(service.hasDisplacement ?? false);
    } else {
      setError('Serviço não encontrado');
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name && price) {
      updateService(id, {
        name,
        price: parseFloat(price),
        image: image || undefined,
        hasDisplacement,
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push('/services');
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
          href="/services"
          className="text-blue-600 hover:text-blue-800 underline mt-4 inline-block"
        >
          ← Voltar para Serviços
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link
          href="/services"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Voltar para Serviços
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Editar Serviço</h1>

      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Serviço atualizado com sucesso! Redirecionando...
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Nome do Serviço *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Troca de Óleo"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Preço do Serviço (R$) *
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
          label="Imagem do Serviço"
          className="mb-6"
        />

        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={hasDisplacement}
                onChange={(e) => setHasDisplacement(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-checked:bg-orange-500 rounded-full transition-colors"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
            <div>
              <span className="font-bold text-white block">Tem deslocamento (KM)?</span>
              <span className="text-slate-400 text-sm">Habilita cálculo de custo por quilômetro no PDV</span>
            </div>
          </label>
        </div>

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
