import React, { useState } from 'react';
import { X, Search, ShoppingBag, ArrowRight, MessageSquare } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  onClose: () => void;
  orders: Order[];
  onSelectOrderToPay: (order: Order) => void;
}

export default function OrderTrackingModal({ onClose, orders, onSelectOrderToPay }: OrderTrackingModalProps) {
  const [phoneQuery, setPhoneQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const foundOrders = orders.filter(o => 
    o.phone.trim().replace(/\D/g, '').includes(phoneQuery.trim().replace(/\D/g, '')) && phoneQuery.trim().length > 3
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-on-surface w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-border-line relative p-6 space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-primary p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="font-display text-xl text-primary">Lacak Pesanan Kamu</h3>
          <p className="text-on-surface-variant text-xs">Masukkan nomor WhatsApp untuk mencari riwayat transaksi Anda.</p>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <div className="relative">
            <input 
              type="tel"
              value={phoneQuery}
              onChange={(e) => {
                setPhoneQuery(e.target.value);
                setHasSearched(true);
              }}
              placeholder="Contoh: 08123456789"
              className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-outline-variant focus:border-secondary transition-all outline-none text-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Search className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Search Results Area */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
          {phoneQuery.trim().length <= 3 ? (
            <p className="text-xs text-center text-on-surface-variant italic opacity-80 py-4">Silakan masukkan nomor telepon minimal 4 digit...</p>
          ) : foundOrders.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <p className="text-xs text-on-surface-variant font-bold">Maaf, pesanan tidak ditemukan.</p>
              <p className="text-[11px] text-on-surface-variant max-w-xs mx-auto leading-relaxed">Pastikan nomor yang diinput sama dengan yang digunakan saat melakukan pemesanan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Hasil Pencarian ({foundOrders.length}):</p>
              
              {foundOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-surface-container-low rounded-2xl border border-border-line space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-primary">{ord.id}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      ord.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                      ord.status === 'Dikirim' ? 'bg-blue-100 text-blue-800' :
                      ord.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                      ord.status === 'Menunggu Konfirmasi' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-primary truncate">
                      {ord.items.map(it => `${it.product.name} (${it.quantity}x)`).join(', ')}
                    </p>
                    <p className="text-secondary font-bold">Total: Rp {ord.total.toLocaleString('id-ID')}</p>
                  </div>

                  {/* If waiting payment/confirmation allow upload proof */}
                  {(ord.status === 'Menunggu Pembayaran' || ord.status === 'Menunggu Konfirmasi') && (
                    <button
                      onClick={() => {
                        onSelectOrderToPay(ord);
                        onClose();
                      }}
                      className="w-full py-2 bg-butter-yellow text-primary rounded-xl font-display text-[10px] tracking-wider uppercase hover:brightness-105 transition-all flex items-center justify-center gap-1"
                    >
                      <span>Selesaikan Pembayaran</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <a 
            href="https://wa.me/628123456789?text=Halo%20TaraBrownies,%20saya%20butuh%20bantuan%20mengenai%20pesanan%20saya"
            target="_blank"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1.5 text-xs text-secondary font-bold hover:underline"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Butuh bantuan? Hubungi WhatsApp Admin</span>
          </a>
        </div>

      </div>
    </div>
  );
}
