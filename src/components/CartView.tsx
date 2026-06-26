import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, Lock, PlusCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onNavigate: (view: string) => void;
  onCheckout: (discountAmount: number, promoApplied: string) => void;
}

export default function CartView({ 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onNavigate,
  onCheckout
}: CartViewProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [discount, setDiscount] = useState<number>(10000); // Default Rp 10.000 initial discount

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'COKLATBLISS') {
      setDiscount(discount + 15000);
      setAppliedPromo('COKLATBLISS');
      alert('Kode promo COKLATBLISS berhasil dipasang! Ekstra diskon Rp 15.000.');
    } else if (code === 'TARA20') {
      const extra = Math.round(subtotal * 0.2);
      setDiscount(discount + extra);
      setAppliedPromo('TARA20');
      alert(`Kode promo TARA20 berhasil dipasang! Diskon 20% sebesar Rp ${extra.toLocaleString('id-ID')}.`);
    } else {
      alert('Maaf, kode promo tidak valid atau kadaluwarsa.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title Block */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl text-primary">Keranjang Kamu</h2>
        <p className="text-on-surface-variant text-sm md:text-base">Brownies hangat sedang menunggumu!</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white p-12 rounded-[26px] border border-border-line text-center space-y-6">
          <div className="text-6xl">🥧</div>
          <h3 className="font-display text-xl text-primary">Keranjang belanjamu kosong</h3>
          <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
            Yuk, jelajahi katalog kue brownies panggang lezat kami dan tambahkan rasa favoritmu!
          </p>
          <button 
            onClick={() => onNavigate('home')}
            className="tactile-button bg-secondary text-on-secondary py-3 px-8 rounded-full font-display text-sm"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        /* Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-border-line flex gap-4 items-center shadow-sm hover:shadow-md transition-shadow group relative"
              >
                {/* Product Thumbnail */}
                <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-low border border-border-line">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info and Quantity Controls */}
                <div className="flex-grow flex flex-col justify-between h-24 md:h-28 py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-base md:text-lg text-primary">{item.product.name}</h3>
                      <p className="text-on-surface-variant text-xs mt-0.5">
                        {item.selectedSize} {item.selectedTopping && item.selectedTopping !== 'None' ? `• Topping: ${item.selectedTopping}` : ''}
                      </p>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Pricing and Controls row */}
                  <div className="flex justify-between items-end">
                    <span className="font-display text-base md:text-lg text-secondary">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </span>

                    <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-full border border-border-line shadow-sm">
                      <button 
                        onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-primary transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container-highest text-primary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dash Box: Add more */}
            <div 
              onClick={() => onNavigate('home')}
              className="p-6 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant flex items-center justify-center group cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-2 text-on-surface-variant group-hover:text-secondary font-bold transition-colors">
                <PlusCircle className="w-5 h-5" />
                <span>Tambah menu lainnya</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Drawer */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-surface-container p-6 rounded-[28px] border border-border-line looming-shadow flex flex-col gap-6">
              <h3 className="font-display text-lg text-primary">Ringkasan Pesanan</h3>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Ongkos Kirim</span>
                  <span className="font-bold text-teal-600">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Diskon (Promo Awal)</span>
                  <span className="font-bold text-secondary">- Rp {discount.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="h-px bg-border-line my-1" />
                
                <div className="flex justify-between items-end pt-1">
                  <span className="font-display text-md text-primary">Total</span>
                  <span className="font-display text-2xl text-secondary">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="relative">
                <input 
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Punya kode promo? (COKLATBLISS)"
                  className="w-full pl-4 pr-24 py-3 rounded-full border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary bg-surface-container-lowest font-sans text-sm outline-none transition-all"
                />
                <button 
                  onClick={handleApplyPromo}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-secondary text-white px-4 rounded-full font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
                >
                  PAKAI
                </button>
              </div>

              {/* Checkout tactile button */}
              <button 
                onClick={() => onCheckout(discount, appliedPromo)}
                className="tactile-button bg-secondary text-on-secondary w-full py-4 rounded-full font-display text-sm tracking-widest flex items-center justify-center gap-2 hover:brightness-105 active:translate-y-1 transition-all"
              >
                CHECKOUT SEKARANG
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5 opacity-80">
                <Lock className="w-3.5 h-3.5" />
                <span>Pembayaran aman &amp; terenkripsi</span>
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
