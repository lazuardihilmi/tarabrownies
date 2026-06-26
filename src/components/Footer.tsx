import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-primary text-on-primary w-full border-t border-border-line py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <h2 className="font-display text-2xl text-butter-yellow tracking-tight">TaraBrownies</h2>
          <p className="text-sm opacity-80 max-w-sm">
            Kebahagiaan yang dipanggang langsung dari dapur kami ke rumahmu. Baking happiness into every square.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-butter-yellow hover:underline transition-all"
          >
            Our Story
          </button>
          <a 
            href="https://wa.me/628123456789" 
            target="_blank" 
            referrerPolicy="no-referrer" 
            className="hover:text-butter-yellow hover:underline transition-all"
          >
            Contact Us
          </a>
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-butter-yellow hover:underline transition-all"
          >
            Privacy Policy
          </button>
        </div>
      </div>
      
      <div className="max-w-container-max mx-auto h-px bg-white/10 my-6" />
      
      <p className="text-center text-xs opacity-60">
        © 2026 TaraBrownies Artisanal Bakery. Dibuat dengan penuh cinta dari dapur rumahan.
      </p>
    </footer>
  );
}
