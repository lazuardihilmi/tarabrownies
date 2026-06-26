import React, { useState, useRef } from 'react';
import { Copy, CloudUpload, CheckCircle, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { Order } from '../types';

interface PaymentViewProps {
  order: Order;
  onConfirmPayment: (orderId: string, proofUrl: string) => void;
  onNavigate: (view: string) => void;
}

export default function PaymentView({ order, onConfirmPayment, onNavigate }: PaymentViewProps) {
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(order.total.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      
      // Simulate beautiful file upload locally
      const reader = new FileReader();
      reader.onload = (event) => {
        setTimeout(() => {
          setPreviewUrl(event.target?.result as string || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtr81YclMNuQ8YXQa7NBg5wL2QvF4JJHCuIfdCfHLte7M2tORq-kqgZ78bDgCGWZkyboMGFLTsTcW4TwvYhmNUwQZZW6ZiaGYiNXvvdAfzgzafnGw0DaW482xQJyTz0yU7sgh8APu9yUa36EUGV5ABVUORgTix6OQKjP9aNaroYJLN1n4eVtILtOwQ31ikpJByKOh97ipox8iWh4rl-st6FccJJEF4Sdiqc5PMSVWyLTJN-1TClhhwP4S5EX8CsK6XnXTAAx52kyI');
          setUploading(false);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitConfirmation = () => {
    if (!previewUrl) return;
    onConfirmPayment(order.id, previewUrl);
  };

  // Bank transfer info depending on choice
  const bankDetails = {
    BCA: {
      name: 'Bank BCA',
      account: '8830 1234 56',
      holder: 'a/n Tara Brownies Indonesia',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZk7o00e5EHTwMBhNs_aQL1yhG8gfBK0asuo8dFt-HJh-NqhAtfVwnQELI3yGAoe8ELsOkvYZxuWRwY2Vbww-AYeE3-7dCVVAzmLv1_ygXo-Yp3W3UWY6ZNnBDspiL4mQlsERZAP_R5LXOGzbG2u18Ho2HEyvVaWXpXcbVixRIESOJF6XIKwIUwwDKY1dKBUmUnwgNY87jS4385pJnaT1hoGOiQ285DMvevddyrbclekZSP_z0hhPAydVEm1NMiY6Lqq6LEEo0aPc'
    },
    Mandiri: {
      name: 'Bank Mandiri',
      account: '123 00 9876 543',
      holder: 'a/n Tara Brownies Indonesia',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRAG0Oa6xybKgUUKyMi8de7lIWoDhZnWHa0XZnKFfB7ytx-Cy_tNuOdw_pIOj27KvmExyhwM_5HKr8IQLJjiRrAX3yZ4d9YN19eWPJcDAmgtOizFY2aYLYBpaF2_EGNtyro18DKQSG5LZzplRWReaDGOHJsCG5T-2YmUBh5gf_YghD5c9OmXPl4Uj_arYKpDe4RbTlauAFhv2Etu8y8eE2beV5sKAiKjeh8wGoBHTy2fYAvyJifHVrnzWioOaMfTTQydmUWnPo6L4'
    },
    BRI: {
      name: 'Bank BRI',
      account: '0012 01 000456 501',
      holder: 'a/n Tara Brownies Indonesia',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZk7o00e5EHTwMBhNs_aQL1yhG8gfBK0asuo8dFt-HJh-NqhAtfVwnQELI3yGAoe8ELsOkvYZxuWRwY2Vbww-AYeE3-7dCVVAzmLv1_ygXo-Yp3W3UWY6ZNnBDspiL4mQlsERZAP_R5LXOGzbG2u18Ho2HEyvVaWXpXcbVixRIESOJF6XIKwIUwwDKY1dKBUmUnwgNY87jS4385pJnaT1hoGOiQ285DMvevddyrbclekZSP_z0hhPAydVEm1NMiY6Lqq6LEEo0aPc'
    }
  };

  const selectedBank = bankDetails[order.paymentMethod] || bankDetails.BCA;

  return (
    <div className="space-y-8 pb-16">
      {/* Header section */}
      <div className="space-y-1.5 text-center md:text-left">
        <h2 className="font-display text-3xl text-primary">Selesaikan Pembayaran</h2>
        <p className="text-on-surface-variant text-sm max-w-xl">
          Silakan lakukan transfer sesuai dengan detail di bawah ini agar pesananmu segera kami proses oleh tim kami.
        </p>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Bank Details & Total cost summary */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Payment cost amount banner card */}
          <div className="bg-surface-container-low rounded-[26px] p-6 border border-border-line looms-shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-bold text-xs tracking-widest text-on-surface-variant uppercase">TOTAL PEMBAYARAN</span>
              <span className="bg-mint-accent text-primary px-3 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase">
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="font-display text-3xl md:text-4xl text-secondary">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
              <button 
                onClick={handleCopy}
                className="text-secondary bg-surface-container-highest p-1.5 rounded-lg active:scale-90 transition-transform"
                title="Salin Nominal"
              >
                <Copy className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-green-600 font-bold ml-2">Tersalin!</span>}
            </div>

            <p className="text-xs text-on-surface-variant italic">ID Pesanan: {order.id}</p>
          </div>

          {/* Bank Instructions Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Selected Active Bank */}
            <div className="bg-white border-2 border-secondary rounded-[26px] p-5 flex items-start gap-4 shadow-md">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border border-border-line shadow-sm overflow-hidden p-1">
                <img 
                  src={selectedBank.logo} 
                  alt={selectedBank.name}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="space-y-1">
                <p className="font-label-bold text-xs text-secondary tracking-widest uppercase">{selectedBank.name}</p>
                <p className="font-display text-xl text-primary tracking-wider">{selectedBank.account}</p>
                <p className="text-xs text-on-surface-variant font-bold">{selectedBank.holder}</p>
              </div>
            </div>

            {/* Inactive Secondary reference (Mandiri if BCA or BCA if Mandiri/BRI) */}
            <div className="bg-white/50 border border-border-line rounded-[26px] p-5 flex items-start gap-4 opacity-40 grayscale">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 border border-border-line">
                <span className="text-sm font-bold text-primary">ID</span>
              </div>
              <div className="space-y-1">
                <p className="font-label-bold text-xs text-primary tracking-widest uppercase">Alt Transfer</p>
                <p className="font-display text-lg text-primary tracking-wider">Layanan Terkunci</p>
                <p className="text-xs text-on-surface-variant">Hanya menerima rekening pilihan utama</p>
              </div>
            </div>

          </div>

          {/* Step instructions */}
          <div className="space-y-4">
            <h3 className="font-display text-lg text-primary">Cara Pembayaran</h3>
            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold shrink-0 text-sm">1</div>
                <p className="text-on-surface-variant text-sm py-1">
                  Pilih bank tujuan transfer (<strong>{order.paymentMethod}</strong>) sesuai dengan nomor rekening resmi di atas.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold shrink-0 text-sm">2</div>
                <p className="text-on-surface-variant text-sm py-1">
                  Masukkan nominal transfer <strong>Rp {order.total.toLocaleString('id-ID')}</strong> tepat sampai ke angka terakhir.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold shrink-0 text-sm">3</div>
                <p className="text-on-surface-variant text-sm py-1">
                  Simpan bukti transfer Anda dan upload screenshot / fotonya di kolom yang tersedia di samping kanan halaman ini.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Drag, Drop, or Select Image Proof */}
        <div className="lg:col-span-5">
          <div className="bg-white border-2 border-dashed border-outline-variant rounded-[26px] p-6 flex flex-col items-center text-center sticky top-24 looms-shadow">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-secondary mb-4 shadow-sm">
              <CloudUpload className="w-8 h-8" />
            </div>

            <h3 className="font-display text-lg text-primary mb-1">Upload Bukti Transfer</h3>
            <p className="text-on-surface-variant text-xs mb-6">Format file: JPG, PNG, atau PDF (Maksimal 5MB)</p>

            {/* Hidden Input File Field */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />

            {/* Selector Trigger Button */}
            {!previewUrl ? (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-butter-yellow border-2 border-primary-container p-6 rounded-2xl flex flex-col items-center gap-1 hover:brightness-105 transition-all active:scale-95 text-primary"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin mb-2" />
                    <span className="font-display text-xs">MENGUNGGAH BUKTI...</span>
                  </>
                ) : (
                  <>
                    <span className="font-display text-sm uppercase tracking-wider">PILIH FOTO / SCREENSHOT</span>
                    <span className="text-xs opacity-75">Klik untuk menjelajahi file</span>
                  </>
                )}
              </button>
            ) : (
              /* Preview Block If Image Selected */
              <div className="w-full space-y-4">
                <div className="relative w-full aspect-[4/3] bg-surface-container-low rounded-2xl overflow-hidden border border-border-line">
                  <img 
                    src={previewUrl} 
                    alt="Uploaded payment proof"
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={handleRemoveFile}
                    className="absolute top-2.5 right-2.5 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors active:scale-90"
                    title="Hapus Bukti"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 p-2.5 rounded-xl border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Bukti siap dikirim untuk verifikasi!</span>
                </div>
              </div>
            )}

            {/* Confirm Payment CTA button */}
            <button 
              onClick={handleSubmitConfirmation}
              disabled={!previewUrl}
              className={`w-full mt-6 py-4 rounded-full font-display text-sm tracking-widest uppercase transition-all ${
                previewUrl 
                  ? 'bg-secondary text-on-secondary hover:brightness-115 active:translate-y-1 tactile-button' 
                  : 'bg-on-surface/10 text-on-surface/40 cursor-not-allowed border border-transparent'
              }`}
            >
              Konfirmasi Pembayaran
            </button>

            <p className="mt-4 text-[10px] text-on-surface-variant leading-relaxed opacity-85">
              Dengan menekan tombol di atas, Anda menyatakan bahwa data transfer yang diberikan adalah benar, valid, dan sah.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
