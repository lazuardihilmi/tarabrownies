import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ArrowRight, MessageCircle, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface CatalogViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onInstantAddToCart: (product: Product) => void;
  onNavigate: (view: string) => void;
  onOpenTracking: () => void;
}

export default function CatalogView({ 
  products, 
  onSelectProduct, 
  onInstantAddToCart, 
  onNavigate,
  onOpenTracking
}: CatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Brownies' | 'Premium'>('Semua');

  const filteredProducts = selectedCategory === 'Semua' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-12 pb-16">
      {/* Home Hero Header Section */}
      <section className="relative overflow-hidden bg-surface-container rounded-[38px] p-8 md:p-12 border border-border-line looming-shadow flex flex-col md:flex-row items-center gap-8 mt-4">
        {/* Abstract organic background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container rounded-full blur-[90px] opacity-25" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-mint-accent rounded-full blur-[80px] opacity-20" />

        {/* Hero Left Content */}
        <div className="flex-grow space-y-6 text-center md:text-left md:max-w-xl z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-border-line px-4 py-1.5 rounded-full text-secondary text-xs font-bold tracking-widest uppercase">
            <span>⭐️</span> ASLI RUMAHAN
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary leading-tight">
            Brownies rumahan yang siap bikin hari lebih manis
          </h2>
          
          <p className="text-on-surface-variant font-sans text-base md:text-lg leading-relaxed">
            Dibuat dengan resep rahasia keluarga, cokelat premium, dan penuh cinta untuk menemani setiap momen spesialmu.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            <button 
              onClick={() => {
                const element = document.getElementById('catalog-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="tactile-button bg-secondary text-on-secondary w-full sm:w-auto py-3.5 px-8 rounded-full font-display text-sm tracking-widest hover:brightness-110 active:translate-y-1 transition-all"
            >
              Pesan sekarang
            </button>
            <button 
              onClick={onOpenTracking}
              className="bg-white/90 hover:bg-white text-primary border-2 border-primary-container w-full sm:w-auto py-3 px-8 rounded-full font-display text-sm tracking-widest active:scale-95 transition-all shadow-sm"
            >
              Cek pesanan
            </button>
          </div>
        </div>

        {/* Hero Right Visual Banner */}
        <div className="w-full md:w-[320px] lg:w-[400px] h-64 md:h-[380px] rounded-[32px] overflow-hidden border-2 border-primary-container relative shrink-0 shadow-lg">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM" 
            alt="Warm inviting fresh brownies" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-border-line text-xs font-bold text-primary flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            <span>Freshly Baked Every Day at 8 AM</span>
          </div>
        </div>
      </section>

      {/* Featured Menu Title Block */}
      <div id="catalog-section" className="text-center space-y-3 pt-6">
        <h3 className="font-display text-3xl md:text-4xl text-primary">Our Sweet Catalog</h3>
        <p className="text-on-surface-variant max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Setiap brownies dipanggang dalam batch kecil menggunakan cokelat couverture premium dan penuh rasa cinta. Cari rasa favoritmu hari ini!
        </p>

        {/* Category Pill Filters */}
        <div className="flex justify-center gap-2 pt-4">
          {(['Semua', 'Brownies', 'Premium'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-display text-xs tracking-wider transition-all border ${
                selectedCategory === cat 
                  ? 'bg-secondary text-white border-secondary shadow-md scale-105' 
                  : 'bg-white text-on-surface-variant border-border-line hover:bg-surface-container-low'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((p) => (
          <motion.div 
            layout
            key={p.id}
            className="bg-white rounded-[26px] overflow-hidden border border-border-line soft-shadow hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            {/* Image banner wrapper with badge */}
            <div className="relative h-48 md:h-52 overflow-hidden bg-surface-container-low cursor-pointer" onClick={() => onSelectProduct(p)}>
              <img 
                src={p.image} 
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {p.badge && (
                <div className="absolute top-3 left-3 bg-mint-accent text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/20 shadow-sm">
                  {p.badge}
                </div>
              )}
              {p.rating && (
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  <span>{p.rating}</span>
                </div>
              )}
            </div>

            {/* Product description area */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div>
                <h4 
                  onClick={() => onSelectProduct(p)}
                  className="font-display text-lg md:text-xl text-primary cursor-pointer hover:text-secondary transition-colors line-clamp-1"
                >
                  {p.name}
                </h4>
                <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed mt-1 line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg text-secondary">Rp {p.price.toLocaleString('id-ID')}</span>
                  {p.originalPrice && (
                    <span className="text-xs line-through text-on-surface-variant">
                      Rp {p.originalPrice.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onInstantAddToCart(p);
                  }}
                  className="tactile-button bg-butter-yellow text-primary w-full py-2.5 rounded-xl font-display text-xs tracking-wider flex items-center justify-center gap-1.5 hover:brightness-105"
                >
                  <ShoppingCart className="w-4 h-4" />
                  + KERANJANG
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Promo Banner (Custom Hampers Available) */}
      <section className="bg-primary text-on-primary rounded-[32px] overflow-hidden border-2 border-primary-container looming-shadow p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary rounded-full blur-[70px] opacity-25" />
        
        <div className="space-y-4 text-center md:text-left md:max-w-xl z-10">
          <h3 className="font-display text-3xl md:text-4xl text-butter-yellow">
            Custom Hampers Available
          </h3>
          <p className="text-sm md:text-base opacity-80 leading-relaxed">
            Kirimkan kebahagiaan dengan kotak hadiah custom untuk momen spesial Anda (pernikahan, ulang tahun, hantaran, dll). Kami menerima pesanan hampers dengan kemasan eksklusif.
          </p>
          <div className="pt-2">
            <a 
              href="https://wa.me/628123456789?text=Halo%20TaraBrownies,%20saya%20tertarik%20tanya%20tentang%20custom%20hampers"
              target="_blank"
              referrerPolicy="no-referrer"
              className="inline-flex items-center gap-2 bg-butter-yellow text-primary hover:brightness-105 font-display text-sm tracking-wider uppercase px-6 py-3 rounded-full transition-all active:scale-95 border-2 border-primary"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Konsultasi Hampers
            </a>
          </div>
        </div>

        <div className="w-48 h-48 md:w-56 md:h-56 bg-surface-container rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl8ko9TQaaVYJTnYUPYZpXbIiIfD2BpeRktr-QrA-3hs8cw04oiloDiydYdtL6mdLkky4XNLCoYzjwnGpTMOx9rK7y7xKVvS4gr6pthUUGqPlSC0ntmtTddLT1yWAMi6Izllw4BrOpReOPH5RmquMhN9UNJmrDp-E7fPI2TbYo0SYnscACKYbEOrAr4y5v7wDvbUL0TjVcB0auxRmP06jWROJyKpp7vo1lC4bKb2TvBuTCDUPzH6GcOs2OrxODvcUZ4NRlGAES6BQ" 
            alt="Gift Box" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
