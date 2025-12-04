'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Layers, X, ChevronDown } from 'lucide-react';
import { Cidade } from '@/types';

interface FiltersProps {
  cidades: Cidade[];
  cidadeAtual?: string;
}

export default function Filters({ cidades, cidadeAtual }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Estados dos filtros
  const [precoMin, setPrecoMin] = useState(searchParams.get('preco_min') || '');
  const [precoMax, setPrecoMax] = useState(searchParams.get('preco_max') || '');
  const [verificada, setVerificada] = useState(searchParams.get('verificada') === '1');
  const [online, setOnline] = useState(searchParams.get('online') === '1');
  const [ordenar, setOrdenar] = useState(searchParams.get('ordenar') || '');

  const handleOrdenar = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('ordenar', value);
    } else {
      params.delete('ordenar');
    }
    router.push(`?${params.toString()}`);
  };

  const aplicarFiltros = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (precoMin) params.set('preco_min', precoMin);
    else params.delete('preco_min');
    
    if (precoMax) params.set('preco_max', precoMax);
    else params.delete('preco_max');
    
    if (verificada) params.set('verificada', '1');
    else params.delete('verificada');
    
    if (online) params.set('online', '1');
    else params.delete('online');
    
    router.push(`?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const limparFiltros = () => {
    setPrecoMin('');
    setPrecoMax('');
    setVerificada(false);
    setOnline(false);
    router.push('/acompanhantes');
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* Tabs de Gênero */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg whitespace-nowrap">
          <span>♀</span>
          Mulheres
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-300 whitespace-nowrap transition-colors">
          <span>♂</span>
          Homens
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:border-gray-300 whitespace-nowrap transition-colors">
          <span>⚧</span>
          Trans
        </button>
      </div>

      {/* Controles de Ordenação e Filtro */}
      <div className="flex items-center gap-3 mt-4">
        {/* Select Ordenar */}
        <div className="relative">
          <select
            value={ordenar}
            onChange={(e) => handleOrdenar(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Ordenar</option>
            <option value="relevancia">Relevância</option>
            <option value="preco_asc">Menor preço</option>
            <option value="preco_desc">Maior preço</option>
            <option value="mais_recentes">Mais recentes</option>
            <option value="online">Online agora</option>
          </select>
          <Layers className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
        </div>

        {/* Botão Filtrar */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:border-gray-400 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          Filtrar
        </button>
      </div>

      {/* Modal de Filtros */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white w-full md:w-[480px] md:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-gray">Filtros</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Faixa de Preço */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-3">
                  Faixa de Preço (R$/hora)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={precoMin}
                    onChange={(e) => setPrecoMin(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-gray-400">até</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={precoMax}
                    onChange={(e) => setPrecoMax(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-dark-gray">Apenas verificadas</span>
                  <button
                    onClick={() => setVerificada(!verificada)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      verificada ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        verificada ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </label>
                
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-dark-gray">Online agora</span>
                  <button
                    onClick={() => setOnline(!online)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      online ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        online ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-3">
                  Cidade
                </label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="">Todas as cidades</option>
                  {cidades.map((cidade) => (
                    <option key={cidade.id} value={cidade.slug}>
                      {cidade.name} ({cidade.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3">
              <button
                onClick={limparFiltros}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={aplicarFiltros}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
