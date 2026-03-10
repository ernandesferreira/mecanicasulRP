'use client';

import { useState, useRef } from 'react';
import { convertFileToBase64, validateImageFile, compressImage } from '@/utils/imageUpload';

interface ImageUploadProps {
  value?: string;
  onChange: (imageData: string | undefined) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label = "Imagem", className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsUploading(true);

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error!);
        setIsUploading(false);
        return;
      }

      // Compress and convert to base64
      const compressedImage = await compressImage(file);
      onChange(compressedImage);
    } catch (err) {
      setError('Erro ao processar a imagem. Tente novamente.');
      console.error('Image processing error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-slate-300 font-semibold text-sm">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Preview */}
        {value && (
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-slate-600"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">⏳</span>
                Processando...
              </>
            ) : (
              <>
                <span>📷</span>
                {value ? 'Alterar Imagem' : 'Selecionar Imagem'}
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Help Text */}
        <p className="text-slate-500 text-xs">
          Formatos aceitos: JPG, PNG, WebP. Máximo: 5MB. A imagem será comprimida automaticamente.
        </p>
      </div>
    </div>
  );
}