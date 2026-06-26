import React from 'react';
import { ShoppingBag, Menu, Shield, User } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  isAdminLoggedIn?: boolean;
}

export default function Navbar({ currentView, onNavigate, cartCount, isAdminLoggedIn }: NavbarProps) {
  return (
    <header className="w-full top-0 sticky bg-surface z-50 shadow-sm border-b border-border-line">
      <div className="flex items-center justify-between px-gutter-mobile md:px-gutter-desktop h-16 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
            className="p-2 active:scale-95 transition-transform text-secondary hover:bg-surface-container rounded-full"
            title="Lihat Katalog Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <h1 
          onClick={() => onNavigate('home')}
          className="font-display text-headline-lg-mobile md:text-headline-lg text-secondary cursor-pointer hover:opacity-90 select-none tracking-tight flex items-center gap-2"
        >
          <span className="text-2xl md:text-3xl">🍞</span>
          TaraBrownies
        </h1>
        
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => onNavigate('cart')}
            className={`p-2 active:scale-95 transition-transform relative text-secondary rounded-full hover:bg-surface-container ${currentView === 'cart' ? 'bg-surface-container' : ''}`}
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          {isAdminLoggedIn && (
            <button 
              onClick={() => onNavigate(currentView.startsWith('admin') ? 'home' : 'admin-dashboard')}
              className={`p-2 active:scale-95 transition-transform text-secondary rounded-full hover:bg-surface-container ${currentView.startsWith('admin') ? 'bg-secondary text-white hover:bg-secondary/90' : ''}`}
              title="Admin Dashboard"
            >
              <Shield className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
