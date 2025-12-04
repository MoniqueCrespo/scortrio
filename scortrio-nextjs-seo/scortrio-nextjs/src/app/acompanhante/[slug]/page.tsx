import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  BadgeCheck, 
  Phone, 
  Clock, 
  CreditCard,
  ChevronLeft,
  Share2,
  Heart,
  MessageCircle,
  Ruler,
  Scale,
  Sparkles
} from 'lucide-react';
import { getAcompanhante, formatPrice, getWhatsAppLink } from '@/lib/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProfileSchema, BreadcrumbSchema } from '@/components/SchemaMarkup';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scortrio.com';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const acompanhante = await getAcompanhante(params.slug);
  
  if (!acompanhante) {
    return {
      title: 'Perfil não encontrado - ScortRio',
    };
  }

  const title = `${acompanhante.nome}, ${acompanhante.idade} anos - Acompanhante em ${acompanhante.cidade} | ScortRio`;
  const description = `${acompanhante.headline || `Acompanhante em ${acompanhante.cidade}`}. ${acompanhante.bairro ? `${acompanhante.bairro}, ` : ''}${acompanhante.cidade} - ${acompanhante.estado}. ${formatPrice(acompanhante.valor_hora)}/hora.`;
  const url = `${BASE_URL}/acompanhante/${acompanhante.slug}`;

  return {
    title,
    description,
    keywords: [
      `acompanhante ${acompanhante.cidade.toLowerCase()}`,
      acompanhante.bairro ? `acompanhante ${acompanhante.bairro.toLowerCase()}` : '',
      'acompanhantes rj',
      'garotas de programa',
      acompanhante.verificada ? 'acompanhante verificada' : '',
    ].filter(Boolean),
    openGraph: {
      title: `${acompanhante.nome} - Acompanhante em ${acompanhante.cidade}`,
      description: acompanhante.headline || description,
      url,
      siteName: 'ScortRio',
      locale: 'pt_BR',
      type: 'profile',
      images: [
        {
          url: acompanhante.foto_principal,
          width: 600,
          height: 800,
          alt: `${acompanhante.nome} - Acompanhante em ${acompanhante.cidade}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${acompanhante.nome} - Acompanhante em ${acompanhante.cidade}`,
      description: acompanhante.headline || description,
      images: [acompanhante.foto_principal],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function PerfilPage({ params }: PageProps) {
  const acompanhante = await getAcompanhante(params.slug);

  if (!acompanhante) {
    notFound();
  }

  const whatsappLink = acompanhante.whatsapp 
    ? getWhatsAppLink(acompanhante.whatsapp, acompanhante.nome)
    : null;

  return (
    <>
      {/* Schema markup para perfil */}
      <ProfileSchema acompanhante={acompanhante} />
      <BreadcrumbSchema items={[
        { name: 'Início', url: '/' },
        { name: 'Acompanhantes', url: '/acompanhantes' },
        { name: acompanhante.cidade, url: `/acompanhantes?cidade=${acompanhante.cidade_slug || acompanhante.cidade.toLowerCase().replace(/\s+/g, '-')}` },
        { name: acompanhante.nome, url: `/acompanhante/${acompanhante.slug}` },
      ]} />
      
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/acompanhantes" className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6 text-dark-gray" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2">
              <Share2 className="w-5 h-5 text-dark-gray" />
            </button>
            <button className="p-2">
              <Heart className="w-5 h-5 text-dark-gray" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumbs Visual - Desktop */}
        <div className="hidden md:block mb-6">
          <Breadcrumbs items={[
            { name: 'Acompanhantes', url: '/acompanhantes' },
            { name: acompanhante.cidade, url: `/acompanhantes?cidade=${acompanhante.cidade_slug || acompanhante.cidade.toLowerCase().replace(/\s+/g, '-')}` },
            { name: acompanhante.nome, url: `/acompanhante/${acompanhante.slug}` },
          ]} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal - Fotos e Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Galeria de Fotos */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Foto Principal */}
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src={acompanhante.foto_principal}
                  alt={acompanhante.nome}
                  fill
                  priority
                  className="object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {acompanhante.plano === 'vip' && (
                    <span className="flex items-center gap-1 bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-full">
                      ⭐ Top Model
                    </span>
                  )}
                  {acompanhante.verificada && (
                    <span className="flex items-center gap-1 bg-green-500 text-white text-sm font-medium px-3 py-1.5 rounded-full">
                      <BadgeCheck className="w-4 h-4" />
                      Verificada
                    </span>
                  )}
                </div>

                {/* Online Badge */}
                {acompanhante.online && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 text-green-600 text-sm font-medium px-3 py-1.5 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Online agora
                  </div>
                )}
              </div>

              {/* Galeria Thumbnail */}
              {acompanhante.galeria && acompanhante.galeria.length > 0 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {acompanhante.galeria.map((foto, index) => (
                    <div 
                      key={index}
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={foto}
                        alt={`${acompanhante.nome} foto ${index + 1}`}
                        fill
                        className="object-cover hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Descrição */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-dark-gray mb-4">Sobre mim</h2>
              <p className="text-gray-600 leading-relaxed">
                {acompanhante.descricao || acompanhante.headline}
              </p>
            </div>

            {/* Serviços */}
            {acompanhante.servicos && acompanhante.servicos.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-dark-gray mb-4">Serviços</h2>
                <div className="flex flex-wrap gap-2">
                  {acompanhante.servicos.map((servico, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {servico}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Info e Contato */}
          <div className="space-y-6">
            
            {/* Card Principal */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              {/* Nome e Local */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-dark-gray">
                  {acompanhante.nome}, {acompanhante.idade}
                </h1>
                <div className="flex items-center gap-1.5 text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {acompanhante.bairro ? `${acompanhante.bairro}, ` : ''}
                    {acompanhante.cidade} - {acompanhante.estado}
                  </span>
                </div>
                <p className="text-gray-600 mt-3">{acompanhante.headline}</p>
              </div>

              {/* Preços */}
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Valores</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">1 hora</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(acompanhante.valor_hora)}
                    </span>
                  </div>
                  {acompanhante.valor_meia_hora && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">30 minutos</span>
                      <span className="font-semibold text-dark-gray">
                        {formatPrice(acompanhante.valor_meia_hora)}
                      </span>
                    </div>
                  )}
                  {acompanhante.valor_pernoite && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Pernoite</span>
                      <span className="font-semibold text-dark-gray">
                        {formatPrice(acompanhante.valor_pernoite)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Características */}
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Características</h3>
                <div className="grid grid-cols-2 gap-4">
                  {acompanhante.altura && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Ruler className="w-4 h-4 text-primary" />
                      <span>{acompanhante.altura} cm</span>
                    </div>
                  )}
                  {acompanhante.peso && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Scale className="w-4 h-4 text-primary" />
                      <span>{acompanhante.peso} kg</span>
                    </div>
                  )}
                  {acompanhante.atende_local && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Com local</span>
                    </div>
                  )}
                  {acompanhante.aceita_cartao && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span>Aceita cartão</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão WhatsApp */}
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chamar no WhatsApp
                </a>
              )}

              {/* Botões Secundários */}
              <div className="flex items-center gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 transition-colors">
                  <Heart className="w-5 h-5" />
                  Favoritar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Mobile */}
      {whatsappLink && (
        <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">A partir de</p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(acompanhante.valor_hora)}/h
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
