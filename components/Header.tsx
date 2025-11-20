import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';

export type PageView = 'home' | 'catalog' | 'info';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  currentView: PageView;
  onNavigate: (view: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, currentView, onNavigate }) => {
  const [animateCart, setAnimateCart] = useState(false);

  // Trigger animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const navClass = (view: PageView) => 
    `cursor-pointer transition-colors duration-300 ${currentView === view ? 'text-black font-bold border-b-2 border-black' : 'hover:text-black'}`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-4 h-4 bg-black transition-transform duration-500 group-hover:rotate-90"></div>
          <h1 className="text-xl font-bold tracking-tighter text-black">NEXTLAYER</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-zinc-500">
          <button onClick={() => onNavigate('home')} className={navClass('home')}>Inicio</button>
          <button onClick={() => onNavigate('catalog')} className={navClass('catalog')}>Catálogo</button>
          <button onClick={() => onNavigate('info')} className={navClass('info')}>Info & Contacto</button>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenCart}
            className="relative p-2 hover:bg-zinc-50 transition-colors group text-black"
            aria-label="Abrir carrito"
          >
            <div className={`transition-transform duration-300 ${animateCart ? 'scale-125' : 'scale-100'}`}>
              <ShoppingCart className="w-5 h-5" />
            </div>
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-none transition-transform duration-300 ${animateCart ? 'scale-110' : 'scale-100'}`}>
                {cartCount}
              </span>
            )}
          </button>
          {/* Mobile Menu Placeholder */}
          <button className="md:hidden p-2 text-black hover:bg-zinc-50" onClick={() => onNavigate('catalog')}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};