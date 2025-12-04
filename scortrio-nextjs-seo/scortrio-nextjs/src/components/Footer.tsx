import Link from 'next/link';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 hidden md:block">
      <div className="container mx-auto px-4 py-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold">
                <span className="text-dark-gray">Scort</span>
                <span className="text-primary">Rio</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              A melhor plataforma de acompanhantes do Rio de Janeiro. 
              Perfis verificados, fotos reais e total discrição.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Sobre */}
          <div>
            <h3 className="text-sm font-semibold text-dark-gray mb-4">
              Sobre o ScortRio
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Regiões */}
          <div>
            <h3 className="text-sm font-semibold text-dark-gray mb-4">
              Regiões
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/acompanhantes?cidade=copacabana" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Copacabana
                </Link>
              </li>
              <li>
                <Link href="/acompanhantes?cidade=ipanema" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Ipanema
                </Link>
              </li>
              <li>
                <Link href="/acompanhantes?cidade=barra" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Barra da Tijuca
                </Link>
              </li>
              <li>
                <Link href="/acompanhantes?cidade=centro" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Centro
                </Link>
              </li>
              <li>
                <Link href="/acompanhantes?cidade=niteroi" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Niterói
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Para Anunciantes */}
          <div>
            <h3 className="text-sm font-semibold text-dark-gray mb-4">
              Para Anunciantes
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/anunciar" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Anuncie Grátis
                </Link>
              </li>
              <li>
                <Link href="/planos" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Planos Premium
                </Link>
              </li>
              <li>
                <Link href="/dicas" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Dicas de Sucesso
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Text */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-dark-gray mb-3">
            Acompanhantes no Rio de Janeiro
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            O ScortRio é a principal plataforma para encontrar acompanhantes de luxo no Rio de Janeiro. 
            Com perfis verificados e fotos reais, conectamos você às melhores profissionais da cidade. 
            Navegue com segurança e discrição pelos bairros mais desejados: Copacabana, Ipanema, Leblon, 
            Barra da Tijuca e muito mais. Todos os anúncios passam por verificação rigorosa para garantir 
            sua tranquilidade.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            ScortRio Tecnologia LTDA
          </p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ScortRio - Todos os Direitos Reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
