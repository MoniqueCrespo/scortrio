import { MetadataRoute } from 'next'
import { getAcompanhantes, getCidades } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scortrio.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/acompanhantes`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
  ]

  // Páginas de acompanhantes
  let acompanhantesPages: MetadataRoute.Sitemap = []
  try {
    const { data: acompanhantes } = await getAcompanhantes({ per_page: 1000 })
    acompanhantesPages = acompanhantes.map((acomp) => ({
      url: `${BASE_URL}/acompanhante/${acomp.slug}`,
      lastModified: new Date(acomp.atualizado_em || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Erro ao gerar sitemap de acompanhantes:', error)
  }

  // Páginas de cidades
  let cidadesPages: MetadataRoute.Sitemap = []
  try {
    const cidades = await getCidades()
    cidadesPages = cidades.map((cidade) => ({
      url: `${BASE_URL}/acompanhantes/${cidade.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Erro ao gerar sitemap de cidades:', error)
  }

  // Páginas de categorias/gêneros
  const categoriaPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/acompanhantes?genero=mulher`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/acompanhantes?genero=homem`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/acompanhantes?genero=trans`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  return [...staticPages, ...acompanhantesPages, ...cidadesPages, ...categoriaPages]
}
