import { Acompanhante, Cidade, ApiResponse, FiltrosAcompanhante } from '@/types';

// URL da API do WordPress - altere para seu domínio
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://scortrio.com.br/wp-json';

// ============================================
// DADOS MOCK PARA TESTE (remover em produção)
// ============================================

const MOCK_ACOMPANHANTES: Acompanhante[] = [
  {
    id: 1,
    slug: 'gabriela-copacabana',
    nome: 'Gabriela',
    idade: 25,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Copacabana',
    valor_hora: 400,
    headline: 'Morena sofisticada para momentos especiais',
    foto_principal: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'vip',
    online: true,
    whatsapp: '21999999999',
    altura: 170,
    peso: 58,
    servicos: ['Massagem', 'Jantar', 'Viagens'],
  },
  {
    id: 2,
    slug: 'amanda-ipanema',
    nome: 'Amanda',
    idade: 28,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Ipanema',
    valor_hora: 500,
    headline: 'Loira elegante e carinhosa',
    foto_principal: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'vip',
    online: false,
    whatsapp: '21988888888',
    altura: 175,
    peso: 60,
    servicos: ['Festas', 'Eventos', 'Viagens'],
  },
  {
    id: 3,
    slug: 'julia-leblon',
    nome: 'Julia',
    idade: 23,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Leblon',
    valor_hora: 350,
    headline: 'Estudante universitária, discreta',
    foto_principal: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
    galeria: [],
    verificada: false,
    plano: 'premium',
    online: true,
    whatsapp: '21977777777',
    altura: 165,
    peso: 55,
    servicos: ['Massagem', 'Companhia'],
  },
  {
    id: 4,
    slug: 'carolina-barra',
    nome: 'Carolina',
    idade: 30,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Barra da Tijuca',
    valor_hora: 600,
    headline: 'Executiva de luxo, viagens nacionais',
    foto_principal: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'vip',
    online: true,
    whatsapp: '21966666666',
    altura: 172,
    peso: 62,
    servicos: ['Viagens', 'Eventos', 'Jantar', 'Pernoite'],
  },
  {
    id: 5,
    slug: 'beatriz-botafogo',
    nome: 'Beatriz',
    idade: 26,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Botafogo',
    valor_hora: 300,
    headline: 'Ruiva natural, simpática e divertida',
    foto_principal: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'premium',
    online: false,
    whatsapp: '21955555555',
    altura: 168,
    peso: 56,
    servicos: ['Massagem', 'Companhia'],
  },
  {
    id: 6,
    slug: 'fernanda-centro',
    nome: 'Fernanda',
    idade: 24,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Centro',
    valor_hora: 250,
    headline: 'Novinha safada, sem frescura',
    foto_principal: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    galeria: [],
    verificada: false,
    plano: 'free',
    online: true,
    whatsapp: '21944444444',
    altura: 162,
    peso: 52,
    servicos: ['Massagem'],
  },
  {
    id: 7,
    slug: 'larissa-tijuca',
    nome: 'Larissa',
    idade: 27,
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    bairro: 'Tijuca',
    valor_hora: 280,
    headline: 'Morena fitness, corpo definido',
    foto_principal: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'premium',
    online: true,
    whatsapp: '21933333333',
    altura: 170,
    peso: 57,
    servicos: ['Massagem', 'Jantar'],
  },
  {
    id: 8,
    slug: 'patricia-niteroi',
    nome: 'Patricia',
    idade: 29,
    cidade: 'Niterói',
    estado: 'RJ',
    bairro: 'Icaraí',
    valor_hora: 320,
    headline: 'Experiente e sem tabus',
    foto_principal: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'premium',
    online: false,
    whatsapp: '21922222222',
    altura: 167,
    peso: 59,
    servicos: ['Massagem', 'Festas', 'Pernoite'],
  },
  {
    id: 9,
    slug: 'mariana-sp',
    nome: 'Mariana',
    idade: 25,
    cidade: 'São Paulo',
    estado: 'SP',
    bairro: 'Jardins',
    valor_hora: 550,
    headline: 'Top model, atendimento VIP',
    foto_principal: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'vip',
    online: true,
    whatsapp: '11999999999',
    altura: 178,
    peso: 61,
    servicos: ['Viagens', 'Eventos', 'Jantar', 'Pernoite'],
  },
  {
    id: 10,
    slug: 'isabela-sp',
    nome: 'Isabela',
    idade: 22,
    cidade: 'São Paulo',
    estado: 'SP',
    bairro: 'Moema',
    valor_hora: 400,
    headline: 'Universitária, primeira vez no site',
    foto_principal: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
    galeria: [],
    verificada: false,
    plano: 'free',
    online: true,
    whatsapp: '11988888888',
    altura: 164,
    peso: 54,
    servicos: ['Massagem', 'Companhia'],
  },
  {
    id: 11,
    slug: 'camila-sp',
    nome: 'Camila',
    idade: 31,
    cidade: 'São Paulo',
    estado: 'SP',
    bairro: 'Itaim Bibi',
    valor_hora: 700,
    headline: 'Empresária discreta, sigilo absoluto',
    foto_principal: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'vip',
    online: false,
    whatsapp: '11977777777',
    altura: 171,
    peso: 63,
    servicos: ['Viagens', 'Eventos', 'Jantar'],
  },
  {
    id: 12,
    slug: 'renata-bh',
    nome: 'Renata',
    idade: 26,
    cidade: 'Belo Horizonte',
    estado: 'MG',
    bairro: 'Savassi',
    valor_hora: 350,
    headline: 'Mineira gostosa e acolhedora',
    foto_principal: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&h=600&fit=crop',
    galeria: [],
    verificada: true,
    plano: 'premium',
    online: true,
    whatsapp: '31999999999',
    altura: 166,
    peso: 58,
    servicos: ['Massagem', 'Jantar', 'Companhia'],
  },
];

const MOCK_CIDADES: Cidade[] = [
  { id: 1, slug: 'rio-de-janeiro', name: 'Rio de Janeiro', count: 8, estado: 'RJ' },
  { id: 2, slug: 'sao-paulo', name: 'São Paulo', count: 3, estado: 'SP' },
  { id: 3, slug: 'belo-horizonte', name: 'Belo Horizonte', count: 1, estado: 'MG' },
  { id: 4, slug: 'niteroi', name: 'Niterói', count: 1, estado: 'RJ' },
];

// ============================================
// FLAG PARA USAR MOCK OU API REAL
// ============================================
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true; // Mude para false quando conectar ao WP

// ============================================
// FUNÇÕES DE API
// ============================================

export async function getAcompanhantes(
  filtros?: FiltrosAcompanhante
): Promise<ApiResponse<Acompanhante[]>> {
  
  // Usar dados mock para teste
  if (USE_MOCK) {
    let data = [...MOCK_ACOMPANHANTES];
    
    // Aplicar filtros
    if (filtros?.cidade) {
      data = data.filter(a => 
        a.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
      );
    }
    
    if (filtros?.preco_min) {
      data = data.filter(a => a.valor_hora >= filtros.preco_min!);
    }
    
    if (filtros?.preco_max) {
      data = data.filter(a => a.valor_hora <= filtros.preco_max!);
    }
    
    if (filtros?.verificada) {
      data = data.filter(a => a.verificada === true);
    }
    
    if (filtros?.online) {
      data = data.filter(a => a.online === true);
    }
    
    // Ordenação
    if (filtros?.ordenar === 'preco_asc') {
      data.sort((a, b) => a.valor_hora - b.valor_hora);
    } else if (filtros?.ordenar === 'preco_desc') {
      data.sort((a, b) => b.valor_hora - a.valor_hora);
    } else if (filtros?.ordenar === 'online') {
      data.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
    }
    
    // Paginação
    const page = filtros?.page || 1;
    const per_page = filtros?.per_page || 12;
    const start = (page - 1) * per_page;
    const paginatedData = data.slice(start, start + per_page);
    
    return {
      data: paginatedData,
      total: data.length,
      pages: Math.ceil(data.length / per_page),
      current_page: page,
    };
  }
  
  // API Real do WordPress
  const searchParams = new URLSearchParams();
  
  if (filtros?.page) searchParams.set('page', String(filtros.page));
  if (filtros?.per_page) searchParams.set('per_page', String(filtros.per_page));
  if (filtros?.cidade) searchParams.set('cidade', filtros.cidade);
  if (filtros?.preco_min) searchParams.set('preco_min', String(filtros.preco_min));
  if (filtros?.preco_max) searchParams.set('preco_max', String(filtros.preco_max));
  if (filtros?.ordenar) searchParams.set('ordenar', filtros.ordenar);
  if (filtros?.verificada) searchParams.set('verificada', '1');
  if (filtros?.online) searchParams.set('online', '1');
  
  const res = await fetch(
    `${API_URL}/scortrio/v1/acompanhantes?${searchParams}`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) throw new Error('Falha ao carregar acompanhantes');
  
  return res.json();
}

export async function getAcompanhante(slug: string): Promise<Acompanhante | null> {
  
  // Usar dados mock para teste
  if (USE_MOCK) {
    const acompanhante = MOCK_ACOMPANHANTES.find(a => a.slug === slug);
    return acompanhante || null;
  }
  
  // API Real do WordPress
  const res = await fetch(
    `${API_URL}/scortrio/v1/acompanhante/${slug}`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) return null;
  
  return res.json();
}

export async function getCidades(): Promise<Cidade[]> {
  
  // Usar dados mock para teste
  if (USE_MOCK) {
    return MOCK_CIDADES;
  }
  
  // API Real do WordPress
  const res = await fetch(
    `${API_URL}/wp/v2/cidade?per_page=100`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) throw new Error('Falha ao carregar cidades');
  
  return res.json();
}

export async function searchCidades(query: string): Promise<Cidade[]> {
  
  // Usar dados mock para teste
  if (USE_MOCK) {
    return MOCK_CIDADES.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  // API Real do WordPress
  const res = await fetch(
    `${API_URL}/wp/v2/cidade?search=${encodeURIComponent(query)}&per_page=10`,
    { next: { revalidate: 60 } }
  );
  
  if (!res.ok) return [];
  
  return res.json();
}

// Formatação de preço
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
}

// Gerar link do WhatsApp
export function getWhatsAppLink(phone: string, nome: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = encodeURIComponent(
    `Olá ${nome}! Vi seu perfil no ScortRio e gostaria de mais informações.`
  );
  return `https://wa.me/55${cleanPhone}?text=${message}`;
}
