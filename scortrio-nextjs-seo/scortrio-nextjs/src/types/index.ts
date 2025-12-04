export interface Acompanhante {
  id: number;
  slug: string;
  nome: string;
  idade: number;
  cidade: string;
  cidade_slug?: string;
  estado: string;
  bairro?: string;
  valor_hora: number;
  valor_meia_hora?: number;
  valor_pernoite?: number;
  headline: string;
  descricao?: string;
  foto_principal: string;
  foto?: string; // alias para foto_principal
  galeria?: string[];
  verificada: boolean;
  plano: 'free' | 'premium' | 'vip';
  online: boolean;
  whatsapp?: string;
  telefone?: string;
  altura?: number;
  peso?: number;
  medidas?: string;
  cor_olhos?: string;
  cor_cabelo?: string;
  servicos?: string[];
  horario_atendimento?: string;
  atende_local?: boolean;
  aceita_cartao?: boolean;
  ultima_vez_online?: string;
  atualizado_em?: string;
  criado_em?: string;
}

export interface Cidade {
  id: number;
  slug: string;
  name: string;
  count: number;
  estado?: string;
}

export interface Servico {
  id: number;
  slug: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  pages: number;
  current_page: number;
}

export interface FiltrosAcompanhante {
  cidade?: string;
  estado?: string;
  preco_min?: number;
  preco_max?: number;
  idade_min?: number;
  idade_max?: number;
  servicos?: string[];
  verificada?: boolean;
  online?: boolean;
  plano?: string;
  ordenar?: 'relevancia' | 'preco_asc' | 'preco_desc' | 'mais_recentes' | 'online';
  page?: number;
  per_page?: number;
}
