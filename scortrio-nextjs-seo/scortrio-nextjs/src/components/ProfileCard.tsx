import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BadgeCheck, Crown } from 'lucide-react';
import { Acompanhante } from '@/types';
import { formatPrice } from '@/lib/api';

interface ProfileCardProps {
  data: Acompanhante;
}

export default function ProfileCard({ data }: ProfileCardProps) {
  const isPremium = data.plano === 'vip' || data.plano === 'premium';
  const isVip = data.plano === 'vip';

  return (
    <Link
      href={`/acompanhante/${data.slug}`}
      className={`group block rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
        isVip ? 'bg-card-premium' : 'bg-white'
      }`}
    >
      {/* Imagem */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={data.foto_principal}
          alt={data.nome}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badge VIP */}
        {isVip && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <Crown className="w-3 h-3" />
            Top Model
          </div>
        )}
        
        {/* Badge Premium */}
        {data.plano === 'premium' && !isVip && (
          <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Premium
          </div>
        )}
        
        {/* Badge Verificada */}
        {data.verificada && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            <BadgeCheck className="w-3 h-3" />
            Verificada
          </div>
        )}
        
        {/* Indicador Online */}
        {data.online && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Online
          </div>
        )}
        
        {/* Info overlay no mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:hidden">
          <h3 className={`font-semibold text-lg ${isVip ? 'text-white' : 'text-white'}`}>
            {data.nome}, {data.idade}
          </h3>
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {data.bairro ? `${data.bairro}, ` : ''}{data.cidade}
          </div>
        </div>
      </div>
      
      {/* Info - Desktop */}
      <div className={`p-4 hidden md:block ${isVip ? 'text-white' : ''}`}>
        <h3 className={`font-semibold text-lg ${isVip ? 'text-white' : 'text-dark-gray'}`}>
          {data.nome}, {data.idade}
        </h3>
        
        <div className={`flex items-center gap-1 text-sm mt-1 ${isVip ? 'text-gray-300' : 'text-gray-500'}`}>
          <MapPin className="w-3.5 h-3.5" />
          {data.bairro ? `${data.bairro}, ` : ''}{data.cidade} - {data.estado}
        </div>
        
        <p className={`text-sm mt-2 line-clamp-1 ${isVip ? 'text-gray-300' : 'text-gray-600'}`}>
          {data.headline}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className={`font-bold text-lg ${isVip ? 'text-primary' : 'text-primary'}`}>
            {formatPrice(data.valor_hora)}/h
          </span>
          
          {data.atende_local && (
            <span className={`text-xs ${isVip ? 'text-gray-400' : 'text-gray-500'}`}>
              📍 Com local
            </span>
          )}
        </div>
      </div>
      
      {/* Info - Mobile (abaixo da imagem) */}
      <div className={`p-3 md:hidden ${isVip ? 'text-white' : ''}`}>
        <p className={`text-sm line-clamp-1 ${isVip ? 'text-gray-300' : 'text-gray-600'}`}>
          {data.headline}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">
            {formatPrice(data.valor_hora)}/h
          </span>
        </div>
      </div>
    </Link>
  );
}
