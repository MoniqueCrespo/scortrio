import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: {
    default: 'ScortRio - Acompanhantes no Rio de Janeiro',
    template: '%s | ScortRio',
  },
  description: 'Encontre as melhores acompanhantes do Rio de Janeiro. Perfis verificados, fotos reais e total discrição.',
  keywords: ['acompanhantes', 'rio de janeiro', 'escorts', 'garotas de programa'],
  authors: [{ name: 'ScortRio' }],
  creator: 'ScortRio',
  publisher: 'ScortRio',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://scortrio.com.br',
    siteName: 'ScortRio',
    title: 'ScortRio - Acompanhantes no Rio de Janeiro',
    description: 'Encontre as melhores acompanhantes do Rio de Janeiro.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ScortRio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScortRio - Acompanhantes no Rio de Janeiro',
    description: 'Encontre as melhores acompanhantes do Rio de Janeiro.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <Header />
        <main className="pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
