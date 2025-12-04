'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Menu, X, User, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-dark-gray">Scort</span>
              <span className="text-primary">Rio</span>
            </div>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark-gray border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
              <User className="w-4 h-4" />
              Entrar
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-colors">
              Cadastre-se Grátis
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="px-4 py-2 text-xs font-medium text-white bg-primary rounded-full">
              Cadastre-se
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-dark-gray"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link
              href="/acompanhantes"
              className="block py-2 text-dark-gray hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Acompanhantes
            </Link>
            <Link
              href="#"
              className="block py-2 text-dark-gray hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="#"
              className="block py-2 text-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Cadastre-se Grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
