import { Acompanhante } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scortrio.com'

// Schema para a página inicial / listagem
export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ScortRio',
    description: 'Encontre acompanhantes verificadas no Rio de Janeiro. Perfis reais, fotos autênticas e contato direto.',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/acompanhantes?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema para organização/empresa
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ScortRio',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Plataforma de acompanhantes do Rio de Janeiro',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
    sameAs: [
      'https://instagram.com/scortrio',
      'https://twitter.com/scortrio',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema para página de listagem (ItemList)
interface ListingSchemaProps {
  acompanhantes: Acompanhante[]
  cidade?: string
}

export function ListingSchema({ acompanhantes, cidade }: ListingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cidade 
      ? `Acompanhantes em ${cidade}` 
      : 'Acompanhantes no Rio de Janeiro',
    description: cidade
      ? `Lista de acompanhantes verificadas em ${cidade}`
      : 'Lista de acompanhantes verificadas no Rio de Janeiro',
    numberOfItems: acompanhantes.length,
    itemListElement: acompanhantes.slice(0, 10).map((acomp, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/acompanhante/${acomp.slug}`,
      name: acomp.nome,
      image: acomp.foto,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema para perfil individual (Person + LocalBusiness)
interface ProfileSchemaProps {
  acompanhante: Acompanhante
}

export function ProfileSchema({ acompanhante }: ProfileSchemaProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: acompanhante.nome,
    description: acompanhante.headline || acompanhante.descricao,
    image: acompanhante.foto,
    url: `${BASE_URL}/acompanhante/${acompanhante.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: acompanhante.bairro || acompanhante.cidade,
      addressRegion: acompanhante.estado || 'RJ',
      addressCountry: 'BR',
    },
    ...(acompanhante.idade && {
      birthDate: new Date(
        new Date().getFullYear() - acompanhante.idade,
        0,
        1
      ).toISOString().split('T')[0],
    }),
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${acompanhante.nome} - Acompanhante em ${acompanhante.cidade}`,
    description: acompanhante.headline || `Acompanhante em ${acompanhante.bairro || acompanhante.cidade}`,
    provider: {
      '@type': 'Person',
      name: acompanhante.nome,
    },
    areaServed: {
      '@type': 'City',
      name: acompanhante.cidade,
    },
    ...(acompanhante.valor_hora && {
      offers: {
        '@type': 'Offer',
        price: acompanhante.valor_hora,
        priceCurrency: 'BRL',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: acompanhante.valor_hora,
          priceCurrency: 'BRL',
          unitText: 'hora',
        },
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}

// Schema para Breadcrumbs
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Schema para FAQ (se tiver página de FAQ)
interface FAQSchemaProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
