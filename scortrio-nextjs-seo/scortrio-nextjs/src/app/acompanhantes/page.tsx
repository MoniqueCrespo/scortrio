import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAcompanhantes, getCidades } from '@/lib/api';
import ProfileCard from '@/components/ProfileCard';
import Filters from '@/components/Filters';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { 
  WebsiteSchema, 
  OrganizationSchema, 
  ListingSchema,
  BreadcrumbSchema 
} from '@/components/SchemaMarkup';
import { FiltrosAcompanhante } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scortrio.com';

interface PageProps {
  searchParams: {
    cidade?: string;
    page?: string;
    preco_min?: string;
    preco_max?: string;
    verificada?: string;
    online?: string;
    ordenar?: string;
  };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const cidade = searchParams.cidade;
  
  const title = cidade
    ? `Acompanhantes em ${cidade} - ScortRio`
    : 'Acompanhantes no Rio de Janeiro - ScortRio';
  
  const description = cidade
    ? `Encontre as melhores acompanhantes em ${cidade}. Perfis verificados, fotos reais e total discrição.`
    : 'Encontre as melhores acompanhantes do Rio de Janeiro. Perfis verificados, fotos reais e total discrição.';

  const url = cidade 
    ? `${BASE_URL}/acompanhantes?cidade=${cidade}`
    : `${BASE_URL}/acompanhantes`;

  return {
    title,
    description,
    keywords: [
      'acompanhantes rio de janeiro',
      'acompanhantes rj',
      cidade ? `acompanhantes ${cidade.toLowerCase()}` : 'acompanhantes copacabana',
      'garotas de programa rio',
      'acompanhantes verificadas',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'ScortRio',
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.jpg`],
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

async function AcompanhantesList({ searchParams }: PageProps) {
  const filtros: FiltrosAcompanhante = {
    page: Number(searchParams.page) || 1,
    per_page: 12,
    cidade: searchParams.cidade,
    preco_min: searchParams.preco_min ? Number(searchParams.preco_min) : undefined,
    preco_max: searchParams.preco_max ? Number(searchParams.preco_max) : undefined,
    verificada: searchParams.verificada === '1',
    online: searchParams.online === '1',
    ordenar: searchParams.ordenar as FiltrosAcompanhante['ordenar'],
  };

  const [{ data: acompanhantes, total, pages }, cidades] = await Promise.all([
    getAcompanhantes(filtros),
    getCidades(),
  ]);

  const cidadeNome = searchParams.cidade
    ? cidades.find(c => c.slug === searchParams.cidade)?.name || searchParams.cidade
    : null;

  return (
    <>
      {/* Schema markup para listagem */}
      <ListingSchema acompanhantes={acompanhantes} cidade={cidadeNome || 'Rio de Janeiro'} />
      
      {/* Breadcrumbs visual */}
      <Breadcrumbs items={[
        { name: 'Acompanhantes', url: '/acompanhantes' },
        ...(cidadeNome ? [{ name: cidadeNome, url: `/acompanhantes?cidade=${searchParams.cidade}` }] : []),
      ]} />
      
      {/* Filtros */}
      <Filters cidades={cidades} cidadeAtual={searchParams.cidade} />

      {/* Título */}
      <div className="mt-8 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-dark-gray">
          Acompanhantes {cidadeNome ? `em ${cidadeNome}` : 'no Rio de Janeiro'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} {total === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </p>
      </div>

      {/* Grid de Cards */}
      {acompanhantes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {acompanhantes.map((acomp) => (
            <ProfileCard key={acomp.id} data={acomp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma acompanhante encontrada com os filtros selecionados.</p>
        </div>
      )}

      {/* Paginação */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((pageNum) => (
            <a
              key={pageNum}
              href={`?${new URLSearchParams({ ...searchParams, page: String(pageNum) }).toString()}`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                pageNum === (Number(searchParams.page) || 1)
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {pageNum}
            </a>
          ))}
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t border-gray-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-dark-gray mb-3">
              Encontre acompanhantes {cidadeNome ? `em ${cidadeNome}` : 'no Rio de Janeiro'}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              No ScortRio, você encontra as melhores acompanhantes {cidadeNome ? `de ${cidadeNome}` : 'do Rio de Janeiro'} com 
              total segurança e discrição. Todos os perfis são verificados para garantir autenticidade 
              e proporcionar a melhor experiência. Navegue pelos perfis, veja fotos reais e entre em 
              contato diretamente pelo WhatsApp.
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-dark-gray mb-3">
              Segurança e Discrição
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nossa plataforma prioriza sua segurança. Todas as acompanhantes passam por verificação 
              de identidade e fotos. Garantimos total sigilo em todas as interações e não 
              armazenamos dados sensíveis. Sua privacidade é nossa prioridade.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden">
            <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AcompanhantesPage({ searchParams }: PageProps) {
  return (
    <>
      {/* Schemas globais */}
      <WebsiteSchema />
      <OrganizationSchema />
      <BreadcrumbSchema items={[
        { name: 'Início', url: '/' },
        { name: 'Acompanhantes', url: '/acompanhantes' },
        ...(searchParams.cidade ? [{ name: searchParams.cidade, url: `/acompanhantes?cidade=${searchParams.cidade}` }] : []),
      ]} />
      
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<LoadingSkeleton />}>
          <AcompanhantesList searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
