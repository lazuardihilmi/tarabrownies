import React, { useState } from 'react';
import { ArrowLeft, Landmark, Wallet, CreditCard, ShoppingBag, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  discountAmount: number;
  onNavigate: (view: string) => void;
  onSubmitOrder: (formData: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    paymentMethod: 'BCA' | 'Mandiri' | 'BRI';
  }) => void;
}

export default function CheckoutView({ 
  cartItems, 
  discountAmount, 
  onNavigate, 
  onSubmitOrder 
}: CheckoutViewProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BCA' | 'Mandiri' | 'BRI'>('BCA');

  const handleBack = () => {
    onNavigate('cart');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon masukkan Nama Lengkap Anda.');
      return;
    }
    if (!phone.trim()) {
      alert('Mohon masukkan Nomor HP / WhatsApp Anda.');
      return;
    }
    if (!address.trim()) {
      alert('Mohon masukkan Alamat Pengiriman Anda.');
      return;
    }

    onSubmitOrder({
      name,
      phone,
      address,
      notes,
      paymentMethod
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <div className="space-y-6 pb-16">
      {/* Header back navigation */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleBack}
          className="p-2 text-secondary hover:bg-surface-container rounded-full active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-2xl text-primary">Detail Pengiriman</h2>
          <p className="text-on-surface-variant text-xs md:text-sm">Selesaikan pesananmu untuk segera mencicipi kelembutan brownies kami.</p>
        </div>
      </div>

      {/* Main layout form & summary block */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: shipping forms and payment option selectors */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 rounded-[26px] border border-border-line space-y-4 soft-shadow">
            <div className="space-y-1.5">
              <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider pl-2">Nama Lengkap</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama anda"
                className="w-full rounded-full border-2 border-outline-variant px-5 py-3 focus:border-secondary focus:ring-0 bg-transparent font-sans text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider pl-2">Nomor HP / WhatsApp</label>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812xxxx"
                className="w-full rounded-full border-2 border-outline-variant px-5 py-3 focus:border-secondary focus:ring-0 bg-transparent font-sans text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider pl-2">Alamat Lengkap Pengiriman</label>
              <textarea 
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Brownies No. 123, Jakarta Selatan"
                className="w-full rounded-[20px] border-2 border-outline-variant px-5 py-3 focus:border-secondary focus:ring-0 bg-transparent font-sans text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-bold text-xs text-on-surface-variant uppercase tracking-wider pl-2">Catatan Pesanan (Opsional)</label>
              <input 
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Kurangi manis, atau titip di satpam"
                className="w-full rounded-full border-2 border-outline-variant px-5 py-3 focus:border-secondary focus:ring-0 bg-transparent font-sans text-sm outline-none transition-all"
              />
            </div>
          </section>

          {/* Payment method section */}
          <section className="space-y-3">
            <h3 className="font-display text-lg text-primary">Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* BCA option */}
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="payment" 
                  value="bca" 
                  checked={paymentMethod === 'BCA'}
                  onChange={() => setPaymentMethod('BCA')}
                  className="peer sr-only" 
                />
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-transparent peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all group-hover:bg-surface-container-low soft-shadow">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container text-secondary">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <span className="font-label-bold text-sm">BCA</span>
                  <div className="absolute top-2.5 right-2.5 opacity-0 peer-checked:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-4 h-4 text-secondary fill-current text-white" />
                  </div>
                </div>
              </label>

              {/* Mandiri option */}
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="payment" 
                  value="mandiri" 
                  checked={paymentMethod === 'Mandiri'}
                  onChange={() => setPaymentMethod('Mandiri')}
                  className="peer sr-only" 
                />
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-transparent peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all group-hover:bg-surface-container-low soft-shadow">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container text-secondary">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="font-label-bold text-sm">Mandiri</span>
                  <div className="absolute top-2.5 right-2.5 opacity-0 peer-checked:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-4 h-4 text-secondary fill-current text-white" />
                  </div>
                </div>
              </label>

              {/* BRI option */}
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="payment" 
                  value="bri" 
                  checked={paymentMethod === 'BRI'}
                  onChange={() => setPaymentMethod('BRI')}
                  className="peer sr-only" 
                />
                <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border-2 border-transparent peer-checked:border-secondary peer-checked:bg-secondary/5 transition-all group-hover:bg-surface-container-low soft-shadow">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container text-secondary">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="font-label-bold text-sm">BRI</span>
                  <div className="absolute top-2.5 right-2.5 opacity-0 peer-checked:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-4 h-4 text-secondary fill-current text-white" />
                  </div>
                </div>
              </label>

            </div>
          </section>
        </div>

        {/* Right column: Sticky checkout order summary */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-4">
            <section className="bg-white rounded-[26px] overflow-hidden soft-shadow border border-border-line">
              <div className="bg-primary-container p-4">
                <h3 className="text-on-primary font-display text-base md:text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-butter-yellow" />
                  Ringkasan Pesanan
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* List items with small thumbnails */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-label-bold text-xs md:text-sm text-primary line-clamp-1">{item.product.name}</h4>
                        <p className="text-[11px] text-on-surface-variant">Size: {item.selectedSize}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-on-surface-variant">Qty: {item.quantity}</span>
                          <span className="font-label-bold text-xs text-secondary">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-border-line" />

                {/* Calculation cost list */}
                <div className="space-y-2 text-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span className="text-teal-600 font-bold uppercase text-xs">GRATIS</span>
                  </div>
                  <div className="flex justify-between font-display text-md text-primary pt-3 border-t border-border-line">
                    <span>Total</span>
                    <span className="text-xl text-secondary">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* CTA submit payment button */}
                <button 
                  type="submit"
                  className="tactile-button w-full bg-butter-yellow text-primary py-4 rounded-full font-display text-sm tracking-widest mt-4 uppercase hover:brightness-105"
                >
                  Konfirmasi &amp; Bayar
                </button>

                <p className="text-[11px] text-center text-on-surface-variant pt-2 flex items-center justify-center gap-1 opacity-70">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pembayaran aman melalui gerbang enkripsi SSL
                </p>
              </div>
            </section>

            {/* Quality trust badge */}
            <div className="flex items-center justify-center gap-3 py-3 bg-teal-50 border border-teal-200 rounded-full text-teal-800 text-xs font-bold shadow-sm">
              <span className="text-lg">🍪</span>
              <span>Jaminan Kualitas 100% Home-Made</span>
            </div>
          </div>
        </aside>

      </form>
    </div>
  );
}
