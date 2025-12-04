'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserPlus, MapPin, Film } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {/* Cadastre Grátis */}
        <button className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary transition-colors">
          <UserPlus className="w-5 h-5" />
          <span className="text-[10px] font-medium">Cadastre Grátis</span>
        </button>

        {/* Acompanhantes */}
        <Link
          href="/acompanhantes"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/acompanhantes')
              ? 'text-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <div className={`p-2 rounded-full ${isActive('/acompanhantes') ? 'bg-primary/10' : ''}`}>
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">Acompanhantes</span>
        </Link>

        {/* Reels */}
        <button className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-primary transition-colors">
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-medium">Reels</span>
        </button>
      </div>
    </nav>
  );
}
